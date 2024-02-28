import { json } from "@remix-run/node";
import { hashPassword, updateUserByNik } from "~/services/user.server";
import { parseFormData, validateFormData } from "remix-hook-form";
import type { z } from "zod";
import { updateUserSchema } from "~/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthorizationError } from "remix-auth";
import { authenticator } from "./auth.server";
import { commitSession, getSession } from "~/services/session.server";

// Update Profile
export async function updateProfile(request: Request) {
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
    const { password: _, ...updatedUserInfos } = await updateUserByNik(data.nik, {
      ...hasPassword,
      ...infos,
    });

    // Get the current auth session
    const session = await getSession(request.headers.get("_session"));
    // Set the auth session to updated user
    session.set(authenticator.sessionKey, updatedUserInfos);

    return json(
      { status: 200, message: "Berhasil mengubah informasi pengguna." },
      { status: 200, headers: { "Set-Cookie": await commitSession(session) } }
    );
  } catch {
    return json(
      { status: 500, message: "Gagal mengubah informasi pengguna. Silahkan coba lagi." },
      { status: 500 }
    );
  }
}
