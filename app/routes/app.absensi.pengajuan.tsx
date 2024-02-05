import {
  type MetaFunction,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { createPengajuanAction } from "~/actions/pengajuan.server";
import { PengajuanForm } from "~/components/form/pengajuan-form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { isKaryawan } from "~/middlewares/auth.middleware";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await isKaryawan(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    return await createPengajuanAction(request);
  } catch (error: unknown) {
    return error as Error;
  }
};

export const meta: MetaFunction = () => {
  return [{ title: "Absensi Karyawan | Pengajuan" }];
};

export default function Pengajuan() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Pengajuan</h2>
      <Card>
        <CardHeader>
          <CardTitle>Masukkan Pengajuan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PengajuanForm actionData={actionData} />
        </CardContent>
      </Card>
    </div>
  );
}
