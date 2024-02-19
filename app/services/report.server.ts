import { getDaysInMonth, lastDayOfMonth, set } from "date-fns";
import { db } from "~/lib/db";
import { getUsers } from "./user.server";
import { dateParsed } from "~/lib/utils";

export const getReport = async () => {
  const firstMonth = set(new Date(), { date: 1, hours: 0, minutes: 0, seconds: 0 });
  const lastMonth = set(lastDayOfMonth(new Date()), { hours: 23, minutes: 59, seconds: 59 });

  return await db.$transaction(async (tx) => {
    const users = await getUsers();

    const absences = await tx.absence.findMany({
      where: {
        OR: [
          {
            createdAt: {
              gte: firstMonth,
              lte: lastMonth,
            },
          },
          {
            createdAt: {
              gte: firstMonth,
              lte: lastMonth,
            },
            submission: {
              isApproved: true,
            },
          },
        ],
      },
      include: { attendance: true, submission: true },
    });

    const test = users.map(
      (user) =>
        absences
          .filter((absence) => absence.attendance.length === 2)
          .filter((absence) => user.nik === absence.nik).length
    );

    const getTotalDaysInMonth = getDaysInMonth(dateParsed(new Date()));

    return { users, absences };
  });
};
