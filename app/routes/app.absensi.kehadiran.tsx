import { type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { isKaryawan } from "~/middlewares/auth.middleware";
import { getAbsenceAllByNik } from "~/services/absence.server";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { format } from "date-fns";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await isKaryawan(request);
  const absenceUser = await getAbsenceAllByNik(user.nik);
  return { absenceUser };
}

export const meta: MetaFunction = () => {
  return [{ title: "Absensi Karyawan | Kehadiran" }];
};

export default function Settings() {
  const { absenceUser } = useLoaderData<typeof loader>();

  const events = absenceUser.filter(absence => absence.attendance.length > 0).flatMap((absence) => {
    return absence.attendance.map((item) => ({
      title: `${format(item.createdAt, "HH:mm a")} : ${item.status}`,
      date: format(item.createdAt, "yyyy-MM-dd"),
    }));
  });
  console.log(events);
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Kehadiran</h2>
      <FullCalendar
        events={events}
        plugins={[dayGridPlugin]}
        dayCellClassNames={"text-xs lg:text-base"}
        initialView="dayGridMonth"
        buttonText={{
          today: "Hari Ini",
        }}
        height={"100vh"}
        // contentHeight={"auto"}
      />
    </div>
  );
}
