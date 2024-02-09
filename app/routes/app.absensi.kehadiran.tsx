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

  const attendance = absenceUser
    .filter((absence) => absence.attendance.length > 0)
    .flatMap((absence) => {
      return absence.attendance.map((item) => ({
        title: `${format(item.createdAt, "HH:mm a")} : ${item.status}`,
        date: format(item.createdAt, "yyyy-MM-dd"),
        className: absence.attendance.length === 2 ? "bg-green-600 " : "",
      }));
    });

  const submission = absenceUser
    .filter((absence) => absence.submission?.isApproved)
    .flatMap((absence) => {
      return {
        title: `${format(new Date(absence.submission?.startDate!), "dd MMMM yyyy")}-${format(
          new Date(absence.submission?.endDate!),
          "dd MMMM yyyy"
        )}: ${absence.submission?.description}`,
        start: format(absence.submission?.startDate!, "yyyy-MM-dd"),
        end: format(absence.submission?.endDate!, "yyyy-MM-dd"),
        className: "bg-yellow-400 pl-2",
        textColor: "#000",
      };
    });

  return { attendance, submission };
}

export const meta: MetaFunction = () => {
  return [{ title: "Absensi Karyawan | Kehadiran" }];
};

export default function Settings() {
  const { attendance, submission } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Kehadiran</h2>
      <FullCalendar
        eventSources={[
          {
            events: [...attendance, ...submission],
            className: "border-transparent",
          },
        ]}
        plugins={[dayGridPlugin]}
        dayCellClassNames={"text-xs lg:text-base"}
        initialView="dayGridMonth"
        buttonText={{
          today: "Hari Ini",
        }}
        height={"90vh"}
        // contentHeight={"auto"}
      />
    </div>
  );
}
