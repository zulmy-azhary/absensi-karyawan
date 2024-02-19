import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  addDays,
  differenceInBusinessDays,
  differenceInDays,
  eachWeekendOfMonth,
  getDaysInMonth,
  getWeeksInMonth,
} from "date-fns";
import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { dateParsed } from "~/lib/utils";
import { getReport } from "~/services/report.server";

export const loader = async () => {
  const { users, absences } = await getReport();

  const reports = users.map((user) => {
    const getTotalDaysInMonth = getDaysInMonth(dateParsed(new Date()));
    const totalHadir = absences.filter(
      (absence) => absence.attendance.length === 2 && user.nik === absence.nik
    ).length;

    const absenceIzin = absences.filter(
      (absence) => absence.submission?.status === "Izin" && user.nik === absence.nik
    );

    const absenceSakit = absences.filter(
      (absence) => absence.submission?.status === "Sakit" && user.nik === absence.nik
    );

    // Get total days between startDate and endDate of izin except weekend
    const sumOfIzin = absenceIzin.reduce(
      (acc, curr) =>
        acc +
        differenceInBusinessDays(
          addDays(curr.submission?.endDate!, 1),
          curr.submission?.startDate!
        ),
      0
    );

    // Get total days between startDate and endDate of sakit except weekend
    const sumOfSakit = absenceSakit.reduce(
      (acc, curr) =>
        acc +
        differenceInBusinessDays(
          addDays(curr.submission?.endDate!, 1),
          curr.submission?.startDate!
        ),
      0
    );

    return {
      nik: user.nik,
      name: user.name,
      hadir: totalHadir,
      alpa:
        getTotalDaysInMonth -
        eachWeekendOfMonth(dateParsed(new Date())).length -
        (totalHadir + sumOfIzin + sumOfSakit),
      sakit: absenceSakit.length,
      izin: absenceIzin.length,
    };
  });
  return reports;
};

export const meta: MetaFunction = () => {
  return [{ title: "Absensi Karyawan | Laporan" }];
};

export default function Report() {
  const reports = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Laporan Bulanan</h2>
      <Card className="px-6 py-8">
        <Table className="mt-5 text-center border-y">
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Nomor Induk Karyawan</TableHead>
              <TableHead>Hadir</TableHead>
              <TableHead>Izin</TableHead>
              <TableHead>Sakit</TableHead>
              <TableHead>Alpa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.nik}>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.nik}</TableCell>
                <TableCell>{report.hadir}</TableCell>
                <TableCell>{report.izin}</TableCell>
                <TableCell>{report.sakit}</TableCell>
                <TableCell>{report.alpa}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
