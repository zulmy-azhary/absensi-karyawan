import { json } from "@remix-run/node";
import { generateAbsenceToday } from "~/services/absence.server";

// For production
export const loader = async () => {
  try {
    await generateAbsenceToday();

    return json({ message: "Absensi hari ini berhasil dibuat." }, { status: 200 });
  } catch (error) {
    return json({ error }, { status: 500 });
  }
};
