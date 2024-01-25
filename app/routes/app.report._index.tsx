import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getReport } from "~/services/report.server";

export const loader = async () => {
  return await getReport();
  // try {
  // } catch (error: unknown) {
  //   return error as Error;
  // }
};

export const meta: MetaFunction = () => {
  return [{ title: "Absensi Karyawan | Laporan" }];
};

export default function Report() {
  const allAbsence = useLoaderData<typeof loader>();
  console.log(allAbsence);

  return (
    <div>
      <h2 className="text-lg font-medium mb-6">Laporan</h2>
      <Card className="px-6 py-8">
        <Table className="mt-5 text-center border-y">
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Nomor Induk Karyawan</TableHead>
              <TableHead>Alpa</TableHead>
              <TableHead>Sakit</TableHead>
              <TableHead>Izin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody></TableBody>
        </Table>
      </Card>
    </div>
  );
}
