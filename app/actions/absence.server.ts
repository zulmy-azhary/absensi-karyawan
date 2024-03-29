import { json } from "@remix-run/node";
import { getTargetLocation } from "~/services/location.server";
import { calculateDistance, absenceState, dateParsed } from "~/lib/utils";
import { authenticator } from "~/actions/auth.server";
import { AuthorizationError } from "remix-auth";
import { createAbsence, getAbsenceTodayByNik } from "~/services/absence.server";
import { parseFormData, validateFormData } from "remix-hook-form";
import type { z } from "zod";
import { absenceSchema } from "~/schemas/absence.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "~/lib/db";
import { isWeekend } from "date-fns";

export async function createAbsenceAction(request: Request) {
  // Validate user's input
  const { data, errors } = await validateFormData<z.infer<typeof absenceSchema>>(
    await parseFormData(request),
    zodResolver(absenceSchema)
  );

  if (errors) {
    throw new AuthorizationError("Input tidak valid.");
  }

  const { lat, lng } = data;

  // Jika user tidak ter-autentikasi, tolak request
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new AuthorizationError("Forbidden user.");
  }

  // Jika lokasi target tidak ditemukan, tampilkan pesan error
  const targetInfos = await getTargetLocation();
  if (!targetInfos) {
    return json({ status: 403, message: "Tidak ditemukan lokasi target." }, { status: 403 });
  }

  // Jika lokasi user saat ini diluar jangkauan area kerja, maka tampilkan pesan error
  const distance = calculateDistance({ lat, lng }, targetInfos);
  if (distance > targetInfos.radius) {
    return json({ status: 403, message: "Diluar jangkauan area kerja." }, { status: 403 });
  }
  const absenceToday = await getAbsenceTodayByNik(user.nik);

  // Cek status apakah user izin, atau sakit
  if (
    absenceToday?.submission &&
    (absenceToday.submission.status === "Izin" || absenceToday.submission.status === "Sakit")
  ) {
    // Jika Izin atau Sakit dan sudah approved, maka tolak lakukan absensi
    return json(
      { status: 403, message: "Tidak dapat melakukan absensi dikarenakan sedang izin/sakit." },
      { status: 403 }
    );
  }

  const dateNow = dateParsed(new Date());

  // Cek apakah hari ini adalah weekend (sabtu dan minggu)
  if (isWeekend(dateNow)) {
    return json(
      { status: 403, message: "Tidak dapat melakukan absensi di akhir pekan." },
      { status: 403 }
    );
  }

  // Cek state user hari ini
  const absenceStateToday = await absenceState(dateNow, absenceToday?.id);

  if (absenceStateToday === "Belum Bisa Absen Masuk") {
    return json({ status: 403, message: "Belum dapat melakukan absen masuk." }, { status: 403 });
  }

  if (absenceStateToday === "Lakukan Absen Masuk") {
    //! Logic untuk absen masuk di jam 08:00AM - 09:00AM
    await createAbsence({
      name: user.name,
      nik: user.nik,
      attendance: {
        create: {
          lat,
          lng,
          distance,
          status: "Masuk",
        },
      },
    });
    return json({ status: 200, message: "Berhasil melakukan absen masuk." }, { status: 200 });
  }

  if (absenceStateToday === "Sudah Absen Masuk") {
    return json({ status: 403, message: "Sudah melakukan absen masuk." }, { status: 403 });
  }

  if (absenceStateToday === "Absen Masuk Sudah Lewat") {
    return json(
      { status: 403, message: "Sudah tidak dapat melakukan absen masuk." },
      { status: 403 }
    );
  }

  if (absenceStateToday === "Belum Bisa Absen Keluar") {
    return json({ status: 403, message: "Belum dapat melakukan absen keluar." }, { status: 403 });
  }

  if (absenceStateToday === "Lakukan Absen Keluar") {
    //! Logic untuk absen keluar di jam 17:00PM - 22:00PM
    await db.absence.upsert({
      where: { id: absenceToday?.id ?? "" },
      create: {
        name: user.name,
        nik: user.nik,
        attendance: {
          create: {
            lat,
            lng,
            distance,
            status: "Keluar",
          },
        },
      },
      update: {
        attendance: {
          create: {
            lat,
            lng,
            distance,
            status: "Keluar",
          },
        },
      },
    });
    return json({ status: 200, message: "Berhasil melakukan absen keluar." }, { status: 200 });
  }

  if (absenceStateToday === "Sudah Absen Keluar") {
    return json({ status: 403, message: "Sudah melakukan absen keluar." }, { status: 403 });
  }

  if (absenceStateToday === "Absen Keluar Sudah Lewat") {
    return json(
      { status: 403, message: "Sudah tidak dapat melakukan absen keluar." },
      { status: 403 }
    );
  }

  return json({ status: 200, message: "Berhasil melakukan absen." }, { status: 200 });
}
