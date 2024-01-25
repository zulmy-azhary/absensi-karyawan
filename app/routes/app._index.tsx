import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getAbsenceTodayAll } from "~/services/absence.server";
import { isAdmin } from "~/middlewares/auth.middleware";
import { getTotalUsers } from "~/services/user.server";
import { format } from "date-fns";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await isAdmin(request);
  const totalUsers = await getTotalUsers();
  const allAbsenceToday = await getAbsenceTodayAll();

  return json({ totalUsers, allAbsenceToday });
};

export const meta: MetaFunction = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  return [...parentMeta, { title: "Absensi Karyawan | Dashboard" }];
};

export default function DashboardIndex() {
  const { totalUsers, allAbsenceToday } = useLoaderData<typeof loader>();

  return (
    <div>
      <h2 className="text-lg font-medium mb-6">Halaman Dashboard</h2>
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
              <p className="text-3xl font-semibold">0</p>
            </CardContent>
          </Card>
          <Card className="text-center w-full">
            <CardHeader>
              <CardTitle>Total Alpa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">0</p>
            </CardContent>
          </Card>
          <Card className="text-center w-full">
            <CardHeader>
              <CardTitle>Total Izin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">0</p>
            </CardContent>
          </Card>
          <Card className="text-center w-full">
            <CardHeader>
              <CardTitle>Total Sakit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">0</p>
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
                  allAbsenceToday.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell>{absence.name}</TableCell>
                      <TableCell>{absence.nik}</TableCell>
                      <TableCell>{format(absence.createdAt, "dd MMMM yyyy")}</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>Belum ada absensi hari ini.</TableCell>
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
