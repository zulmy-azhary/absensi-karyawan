import { zodResolver } from "@hookform/resolvers/zod";
import { json } from "@remix-run/node";
import { AuthorizationError } from "remix-auth";
import { parseFormData, validateFormData } from "remix-hook-form";
import type { z } from "zod";
import { approvalSchema, pengajuanSchema } from "~/schemas/pengajuan.schema";
import {
  getAbsenceTodayByNik,
  deleteAbsenceById,
  createAbsence,
  getAbsenceById,
  updateAbsenceById,
} from "~/services/absence.server";
import { authenticator } from "~/actions/auth.server";
import { set } from "date-fns";

export async function createPengajuanAction(request: Request) {
  // Validate user's input
  const { data, errors } = await validateFormData<z.infer<typeof pengajuanSchema>>(
    await parseFormData(request),
    zodResolver(pengajuanSchema)
  );

  if (errors) {
    throw new AuthorizationError("Input tidak valid.");
  }
  const { title, description, date } = data;
  // date.from = set(date.from, { minutes: 1 });
  // date.to = set(date.to, { hours: 23, minutes: 59, seconds: 59 });

  // Check if user isn't authenticated, then
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new AuthorizationError("Forbidden user.");
  }

  await createAbsence({
    nik: user.nik,
    name: user.name,
    createdAt: date.from,
    submission: {
      create: {
        status: title,
        description: description,
        startDate: date.from,
        endDate: date.to,
      },
    },
  });

  return json({ status: 200, message: "Sukses membuat pengajuan." }, { status: 200 });
}

export const handleApproval = async (request: Request) => {
  const { data, errors } = await validateFormData<z.infer<typeof approvalSchema>>(
    await parseFormData(request),
    zodResolver(approvalSchema)
  );

  if (errors) {
    throw new AuthorizationError("Input tidak valid.");
  }

  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new AuthorizationError("Forbidden user.");
  }

  const absenceSubmission = await getAbsenceById(data.absenceId);
  if (!absenceSubmission?.submission) {
    return json({ status: 403, message: "Pengajuan tidak dapat diproses." }, { status: 403 });
  }

  const absenceToday = await getAbsenceTodayByNik(absenceSubmission.nik);
  if (absenceToday && absenceSubmission.submission.startDate <= absenceToday.createdAt) {
    await deleteAbsenceById(absenceToday.id);
  }

  await updateAbsenceById(data.absenceId, {
    submission: {
      update: {
        isApproved: true,
      },
    },
  });

  return json({ status: 200, message: "Pengajuan telah disetujui." }, { status: 200 });
};
