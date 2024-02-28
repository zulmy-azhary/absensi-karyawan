import { json } from "@remix-run/node";
import { db } from "~/lib/db";
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
      { status: 403, message: `NIK ${data.nik} sudah ada. Silahkan gunakan yang lain.` },
      { status: 403 }
    );
  }

  const hashedPassword = hashPassword(data.password);

  try {
    // Create user
    await db.user.create({
      data: {
        nik: data.nik,
        name: data.name,
        password: hashedPassword,
      },
    });

    return json({ status: 200, message: "Sukses menambahkan pengguna." }, { status: 200 });
  } catch {
    return json(
      { status: 500, message: "Gagal menambahkan pengguna. Silahkan coba lagi." },
      { status: 500 }
    );
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
    await updateUserByNik(data.nik, {
      ...hasPassword,
      ...infos,
    });

    return json({ status: 200, message: "Berhasil memperbarui pengguna." }, { status: 200 });
  } catch {
    return json(
      { status: 500, message: "Gagal memperbarui pengguna. Silahkan coba lagi." },
      { status: 500 }
    );
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
    await db.absence.deleteMany({
      where: { nik: data.nik },
    });
  }
  await deleteUserByNik(data.nik);

  return json({ status: 200, message: "Sukses menghapus pengguna." }, { status: 200 });
}
