import { json, redirect } from "@remix-run/node";
import { db } from "~/lib/db";
import { commitSession, getSession } from "~/services/session.server";
import { getAbsenceByNik } from "~/services/absence.server";
import {
  deleteUserByNik,
  getUserByNik,
  hashPassword,
  updateUserByNik,
} from "~/services/user.server";
import { parseFormData, validateFormData } from "remix-hook-form";
import type { z } from "zod";
import { deleteUserSchema, updateUserSchema, userSchema } from "~/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthorizationError } from "remix-auth";

// Create User
export async function createUserAction(request: Request) {
  // Validate user's input
  const { data, errors } = await validateFormData<z.infer<typeof userSchema>>(
    await parseFormData(request),
    zodResolver(userSchema)
  );

  if (errors) {
    throw new AuthorizationError("Input tidak valid.");
  }

  const isUserExist = await getUserByNik(data.nik);
  if (isUserExist) {
    return json(
      { message: `NIK ${data.nik} sudah ada. Silahkan gunakan yang lain.` },
      { status: 403 }
    );
  }

  const hashedPassword = hashPassword(data.password);

  try {
    const createdUser = db.user.create({
      data: {
        nik: data.nik,
        name: data.name,
        password: hashedPassword,
      },
    });

    const createdDefaultAbsence = db.absence.create({
      data: {
        nik: data.nik,
        name: data.name,
        status: "Alpa",
      },
    });

    // Create user and default absence
    await db.$transaction([createdUser, createdDefaultAbsence]);

    // Create session for message, and render into index route
    const session = await getSession(request.headers.get("Cookie"));
    session.flash("successCreateUserKey", "Sukses menambahkan pengguna.");
    return redirect("/app/pengguna", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch {
    return json({ message: "Gagal menambahkan pengguna. Silahkan coba lagi." }, { status: 500 });
  }
}

// Update User
export async function updateUser(request: Request) {
  const { data, errors } = await validateFormData<z.infer<typeof updateUserSchema>>(
    await parseFormData(request),
    zodResolver(updateUserSchema)
  );

  if (errors) {
    throw new AuthorizationError("Input tidak valid.");
  }

  const { password, confirmPassword, ...infos } = data;

  try {
    const hasPassword = password ? { password: hashPassword(password) } : null;
    await updateUserByNik(data.nik, { ...hasPassword, ...infos });

    return json({ message: "Berhasil memperbarui pengguna." }, { status: 200 });
  } catch {
    return json({ message: "Gagal memperbarui pengguna. Silahkan coba lagi." }, { status: 500 });
  }
}

// Delete User
export async function deleteUser(request: Request) {
  const { data, errors } = await validateFormData<z.infer<typeof deleteUserSchema>>(
    await parseFormData(request),
    zodResolver(deleteUserSchema)
  );

  if (errors) {
    throw new AuthorizationError("Input tidak valid.");
  }

  const absence = await getAbsenceByNik(data.nik);
  if (absence) {
    // const deleteAbsenceAttendance = db.absenceAttendance.deleteMany({
    //   where: { attendanceId: absence.id },
    // });
    await db.absence.deleteMany({
      where: { nik: data.nik },
    });
    // await db.$transaction([deleteAbsenceAttendance, deleteAbsence]);
  }
  await deleteUserByNik(data.nik);

  return json({ message: "Sukses menghapus pengguna.", data: absence }, { status: 200 });
}
