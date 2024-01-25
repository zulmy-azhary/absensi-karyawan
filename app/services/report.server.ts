import { lastDayOfMonth, set } from "date-fns";
import { db } from "~/lib/db"

export const getReport = async () => {
  const firstMonth = set(new Date(), { date: 1, hours: 0, minutes: 0, seconds: 0 });
  const lastMonth = set(lastDayOfMonth(new Date()), { hours: 23, minutes: 59, seconds: 59 });

  return await db.absence.count({
    where: {
      nik: "111111111",
      createdAt: {
        gte: firstMonth,
        lte: lastMonth
      }
    },
  });
}