import { redirect } from "@remix-run/node";
import { AuthorizationError } from "remix-auth";
import { authenticator } from "~/actions/auth.server";

export async function isAdmin(request: Request) {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new AuthorizationError("Forbidden user.");
  }

  if (user.role !== "Admin") {
    throw redirect("/app/profil");
  }

  return user;
}

export async function isKaryawan(request: Request) {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new AuthorizationError("Forbidden user.");
  }

  if (user.role !== "Karyawan") {
    throw redirect("/app");
  }

  return user;
}