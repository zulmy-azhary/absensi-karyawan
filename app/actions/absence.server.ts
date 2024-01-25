import { json } from "@remix-run/node";
import { getTargetLocation } from "~/services/location.server";
import { calculateDistance } from "~/lib/calculate-distance";
import { authenticator } from "~/actions/auth.server";
import { AuthorizationError } from "remix-auth";
import { createAbsence, getAbsenceTodayByNik, updateAbsenceById } from "~/services/absence.server";
import { parseFormData, validateFormData } from "remix-hook-form";
import type { z } from "zod";
import { absenceSchema } from "~/schemas/absence.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { set } from "date-fns";

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
    return json({ message: "Tidak ditemukan lokasi target." }, { status: 500 });
  }

  // Jika lokasi user saat ini diluar jangkauan area kerja, maka tampilkan pesan error
  const distance = calculateDistance({ lat, lng }, targetInfos);
  if (distance > targetInfos.radius) {
    return json({ message: "Diluar jangkauan area kerja." }, { status: 403 });
  }

  // TODO
  // Cek apakah user sudah melakukan absen atau pengajuan
  const absenceToday = await getAbsenceTodayByNik(user.nik);

  // Cek status apakah user hari ini belum absen
  if (!absenceToday || absenceToday.status === "Alpa") {
    // Jika waktu sekarang sudah jam 08:00 AM atau sebelum jam 09:00 AM, absen masuk sudah bisa dilakukan
    if (new Date() < set(new Date(), { hours: 8 })) {
      return json({ message: "Belum dapat melakukan absen." }, { status: 422 });
    }
    // Jika waktu sudah lewat dari jam 09:00 AM, absen masuk sudah tidak bisa dilakukan
    // Jika waktu sudah jam 17:00 PM sampai jam 22:00 PM, maka absen keluar sudah bisa dilakukan
    // Jika waktu sudah lewwat dari jam 22:00 PM, maka absen keluar sudah tidak bisa dilakukan
    return null;
  }

  // Cek status apakah user izin, atau sakit
  if (absenceToday.status === "Izin" || absenceToday.status === "Sakit") {
    // Jika Izin atau Sakit dan sudah approved, maka tolak lakukan absensi
    return json(
      { message: "Tidak dapat melakukan absensi dikarenakan sedang izin/sakit." },
      { status: 403 }
    );
  }

  return json({ message: "Berhasil melakukan absen." }, { status: 200 });

  // const absence = await getAbsenceTodayByNik(user.nik);
  // // Jika user belum absensi hari ini, maka lakukan absensi masuk
  // if (!absence) {
  //   await createAbsence({
  //     name: user.name,
  //     nik: user.nik,
  //     status: "Masuk",
  //     absenceState: {
  //       create: {
  //         lat,
  //         lng,
  //         distance,
  //         status: "Masuk",
  //       },
  //     },
  //   });

  //   return json({ message: "Berhasil melakukan absensi masuk." }, { status: 200 });
  // }

  // // Jika sudah melakukan absensi masuk, maka lakukan absensi keluar
  // if (absence.status === "Masuk") {
  //   await updateAbsenceById(absence.id, {
  //     status: "Keluar",
  //     absenceState: {
  //       create: {
  //         lat,
  //         lng,
  //         distance,
  //         status: "Keluar",
  //       },
  //     },
  //   });
  //   return json({ message: "Berhasil melakukan absensi keluar." }, { status: 200 });
  // }
}
