import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getAbsenceTodayAll, getSubmissionNotApprovedAll } from "~/services/absence.server";
import { isAdmin } from "~/middlewares/auth.middleware";
import { getTotalUsers } from "~/services/user.server";
import { format } from "date-fns";
import { Badge } from "~/components/ui/badge";
import { ApprovalModal } from "~/components/modal/approval-modal";
import { parseFormData } from "remix-hook-form";
import { handleApproval } from "~/actions/pengajuan.server";
import { useEffect } from "react";
import { toast } from "sonner";
import { dateParsed } from "~/lib/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await isAdmin(request);
  const totalUsers = await getTotalUsers();
  const allAbsenceToday = await getAbsenceTodayAll();
  const allSubmissionNotApproved = await getSubmissionNotApprovedAll();

  return json({ totalUsers, allAbsenceToday, allSubmissionNotApproved });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const requestCloned = request.clone();
  const { action } = await parseFormData<{ action: "APPROVAL" }>(request);

  if (action === "APPROVAL") {
    return await handleApproval(requestCloned);
  }

  throw new Error("Unknown action.");
};

export const meta: MetaFunction = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  return [...parentMeta, { title: "Absensi Karyawan | Dashboard" }];
};

export default function DashboardIndex() {
  const { totalUsers, allAbsenceToday, allSubmissionNotApproved } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (!actionData || !actionData.message) return;

    if (actionData.status === 200) {
      toast.success(actionData.message);
      return;
    }

    toast.error(actionData.message);
  }, [actionData]);

  console.log("Now: ", format(dateParsed(new Date()), "dd-MM-yyyy HH:mm:ss a"));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Halaman Dashboard</h2>
      <div className="space-y-6">
        <div className="flex flex-row justify-between gap-6">
          <Card className="text-center w-full">
            <CardHeader>
              <CardTitle>Total Karyawan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{totalUsers}</p>
            </CardContent>
          </Card>
          <Card className="text-center w-full">
            <CardHeader>
              <CardTitle>Total Hadir</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">
                {allAbsenceToday.filter((absence) => absence.attendance.length === 2).length}
              </p>
            </CardContent>
          </Card>
          <Card className="text-center w-full">
            <CardHeader>
              <CardTitle>Total Alpa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">
                {
                  allAbsenceToday.filter(
                    (absence) => !absence.submission && absence.attendance.length !== 2
                  ).length
                }
              </p>
            </CardContent>
          </Card>
          <Card className="text-center w-full">
            <CardHeader>
              <CardTitle>Total Izin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">
                {allAbsenceToday.filter((absence) => absence.submission?.status === "Izin").length}
              </p>
            </CardContent>
          </Card>
          <Card className="text-center w-full">
            <CardHeader>
              <CardTitle>Total Sakit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">
                {allAbsenceToday.filter((absence) => absence.submission?.status === "Sakit").length}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Rekap Harian</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="text-center border-y">
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Nomor Induk Karyawan</TableHead>
                  <TableHead>Masuk</TableHead>
                  <TableHead>Keluar</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAbsenceToday.length > 0 ? (
                  allAbsenceToday.map((absence) => {
                    const absenMasuk = absence.attendance.find((item) => item.status === "Masuk");
                    const absenKeluar = absence.attendance.find((item) => item.status === "Keluar");

                    return (
                      <TableRow key={absence.id}>
                        <TableCell>{absence.name}</TableCell>
                        <TableCell>{absence.nik}</TableCell>
                        <TableCell>
                          {absenMasuk ? format(absenMasuk.createdAt, "HH:mm a") : "-"}
                        </TableCell>
                        <TableCell>
                          {absenKeluar ? format(absenKeluar.createdAt, "HH:mm a") : "-"}
                        </TableCell>
                        <TableCell>
                          {absence.attendance.length > 0 ? (
                            <Badge
                              className="min-w-[4rem] justify-center"
                              variant={absence.attendance.length === 2 ? "success" : "destructive"}
                            >
                              {absence.attendance.findLast((absence) => absence.status)?.status}
                            </Badge>
                          ) : null}
                          {absence.submission ? (
                            <Badge className="min-w-[4rem] justify-center" variant={"warning"}>
                              {absence.submission.status}
                            </Badge>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>Belum ada absensi hari ini.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pengajuan</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="text-center border-y">
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Approve</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allSubmissionNotApproved.length > 0 ? (
                  allSubmissionNotApproved.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell>{absence.name}</TableCell>
                      <TableCell>{absence.submission?.status}</TableCell>
                      <TableCell>{absence.submission?.description}</TableCell>
                      <TableCell>
                        {format(absence.submission!.startDate, "dd MMMM yyyy")} -{" "}
                        {format(absence.submission!.endDate, "dd MMMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <ApprovalModal absence={absence} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>Tidak ada pengajuan.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
