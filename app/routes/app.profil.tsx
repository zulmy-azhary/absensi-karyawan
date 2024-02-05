import type { MetaFunction } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import type { UserType } from "~/types";


export const meta: MetaFunction = () => {
  return [{ title: "Absensi Karyawan | Profil" }];
};

export default function DashboardProfile() {
  const user = useRouteLoaderData<UserType>("routes/app")!;
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Profil Pengguna</h2>
      <div>Hi {user.name}</div>
    </div>
  );
}
