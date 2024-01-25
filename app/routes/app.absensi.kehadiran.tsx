import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { isKaryawan } from "~/middlewares/auth.middleware";

export async function loader({ request }: LoaderFunctionArgs) {
  await isKaryawan(request);
  return null;
}

export const meta: MetaFunction = () => {
  return [{ title: "Absensi Karyawan | Kehadiran" }];
};

export default function Settings() {
  return (
    <div>
      <h2 className="text-lg font-medium">Kehadiran</h2>
    </div>
  );
}
