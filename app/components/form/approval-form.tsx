import { Form } from "@remix-run/react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { approvalSchema } from "~/schemas/pengajuan.schema";
import type { z } from "zod";
import { useRemixForm } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type ApprovalFormProps = {
  absence: any;
};

export const ApprovalForm = ({ absence }: ApprovalFormProps) => {
  const form = useRemixForm<z.infer<typeof approvalSchema>>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      absenceId: absence.id,
    },
    submitData: {
      action: "APPROVAL",
      startDate: absence.submission.startDate
    }
  });

  return (
    <Form method="post" onSubmit={form.handleSubmit} className="space-y-8 w-full">
      <AlertDialogHeader className="gap-y-2">
        <AlertDialogTitle className="text-center">
          Apakah anda yakin ingin menyetujui pengajuan ini?
        </AlertDialogTitle>
        <AlertDialogDescription className="flex flex-col gap-y-0.5 text-center">
          <strong className="text-primary">Nama: {absence.name}</strong>
          <strong className="text-primary">Nik: {absence.nik}</strong>
          <strong className="text-primary">Status Pengajuan: {absence.submission.status}</strong>
          <strong className="text-primary">Perihal: {absence.submission.description}</strong>
        </AlertDialogDescription>
        <AlertDialogDescription className="text-center">
          Pengajuan akan berlaku setelah disetujui dan akan berlaku sesuai dengan tanggal yang diajukan.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="justify-center">
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction type="submit">Setuju</AlertDialogAction>
      </AlertDialogFooter>
    </Form>
  );
};
