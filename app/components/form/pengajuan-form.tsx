import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { CustomForm } from "~/components/ui/custom-form";
import { CustomSelect } from "~/components/ui/custom-select";
import { SelectItem } from "~/components/ui/select";
import { DatePickerWithRange } from "~/components/ui/date-range-picker";
import { CustomTextarea } from "~/components/ui/custom-textarea";
import { Button } from "~/components/ui/button";
import type { z } from "zod";
import { pengajuanSchema } from "~/schemas/pengajuan.schema";
import { zodResolver } from "@hookform/resolvers/zod";

type PengajuanFormProps = {
  actionData: { message: string } | undefined;
};

export const PengajuanForm = ({ actionData }: PengajuanFormProps) => {
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
    <RemixFormProvider {...form}>
      <CustomForm actionData={actionData} method="post" onSubmit={onSubmit}>
        <CustomSelect
          name="title"
          label="Judul Pengajuan"
          placeholder="Pilih pengajuan..."
          disabled={form.formState.isSubmitting}
        >
          <SelectItem value="Izin">Izin Keperluan</SelectItem>
          <SelectItem value="Sakit">Sakit</SelectItem>
        </CustomSelect>
        <DatePickerWithRange
          name="date"
          label="Tanggal Pengajuan"
          placeholder="Masukkan tanggal pengajuan..."
          disabled={form.formState.isSubmitting}
        />
        <CustomTextarea
          name="description"
          label="Keterangan"
          placeholder="Masukkan keterangan pengajuan..."
          disabled={form.formState.isSubmitting}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Memproses..." : "Buat Pengajuan"}
        </Button>
      </CustomForm>
    </RemixFormProvider>
  );
};
