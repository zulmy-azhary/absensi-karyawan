import { zodResolver } from "@hookform/resolvers/zod";
import {
  type MetaFunction,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { set } from "date-fns";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import type { z } from "zod";
import { createPengajuanAction } from "~/actions/pengajuan.server";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CustomForm } from "~/components/ui/custom-form";
import { CustomSelect } from "~/components/ui/custom-select";
import { CustomTextarea } from "~/components/ui/custom-textarea";
import { DatePickerWithRange } from "~/components/ui/date-range-picker";
import { SelectItem } from "~/components/ui/select";
import { isKaryawan } from "~/middlewares/auth.middleware";
import { pengajuanSchema } from "~/schemas/pengajuan.schema";

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

  const form = useRemixForm<z.infer<typeof pengajuanSchema>>({
    resolver: zodResolver(pengajuanSchema),
    mode: "onChange",
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    form.handleSubmit(e);
    form.reset();
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-6">Pengajuan</h2>
      <Card>
        <CardHeader>
          <CardTitle>Masukkan Pengajuan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RemixFormProvider {...form}>
            <CustomForm actionData={actionData} method="post" onSubmit={onSubmit}>
              <CustomSelect name="title" label="Judul Pengajuan" placeholder="Pilih pengajuan...">
                <SelectItem value="Izin">Izin Keperluan</SelectItem>
                <SelectItem value="Sakit">Sakit</SelectItem>
              </CustomSelect>
              <DatePickerWithRange
                name="date"
                label="Tanggal Pengajuan"
                placeholder="Masukkan tanggal pengajuan..."
              />
              <CustomTextarea
                name="description"
                label="Keterangan"
                placeholder="Masukkan keterangan pengajuan..."
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Memproses..." : "Buat pengajuan"}
              </Button>
            </CustomForm>
          </RemixFormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
