import { redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function isAdmin(request: Request) {
  const user = await authenticator.isAuthenticated(request);
  if (user?.role !== "Admin") {
    throw redirect("/app/profile");
  }
}

export async function isKaryawan(request: Request) {
  const user = await authenticator.isAuthenticated(request);
  if (user?.role !== "Karyawan") {
    throw redirect("/app");
  }
}