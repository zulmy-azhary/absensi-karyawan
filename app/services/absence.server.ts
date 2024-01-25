import { db } from "~/lib/db";
import { set } from "date-fns";
import type { Prisma } from "@prisma/client";

type CreateAbsence = Prisma.Args<typeof db.absence, "create">["data"];
export const createAbsence = async (payload: CreateAbsence) => {
  return await db.absence.create({
    data: payload,
  });
};

// Service for generate all users' absence per day if user doesn't have submission
export const generateAbsenceToday = async () => {
  return db.$transaction(async (tx) => {
    // 1. Get all users
    const users = await tx.user.findMany({
      where: {
        role: "Karyawan",
      },
    });

    // 2. Loop for all users
    for (const user of users) {
      // 3. Check if user's absence is already exist
      const existingAbsence = await tx.absence.findFirst({
        where: {
          nik: user.nik,
          OR: [
            {
              createdAt: {
                gte: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }), // Start
                lte: set(new Date(), { hours: 23, minutes: 59, seconds: 59 }), // End
              },
            },
            {
              status: { in: ["Izin", "Sakit"] },
              createdAt: {
                lte: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
              },
              submission: {
                isApproved: true,
                startDate: {
                  lte: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
                },
                endDate: {
                  gt: set(new Date(), { hours: 23, minutes: 59, seconds: 59 }),
                },
              },
            },
          ],
          NOT: {
            submission: {
              isApproved: false,
            },
          },
        },
      });

      // 4. If absence doesn't exist, create user.
      if (!existingAbsence) {
        await tx.absence.create({
          data: {
            nik: user.nik,
            name: user.name,
            status: "Alpa",
          },
        });
      }
    }
  });
};

type UpdateAbsence = Prisma.Args<typeof db.absence, "update">["data"];
export const updateAbsenceById = async (id: string, payload: UpdateAbsence) => {
  return await db.absence.update({
    where: { id },
    data: payload,
  });
};

export async function getAbsenceTodayByNik(nik: string) {
  const currentAbsence = await db.absence.findFirst({
    where: {
      nik,
      OR: [
        {
          createdAt: {
            gte: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }), // Start
            lte: set(new Date(), { hours: 23, minutes: 59, seconds: 59 }), // End
          },
        },
        {
          status: { in: ["Izin", "Sakit"] },
          createdAt: {
            lte: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
          },
          submission: {
            isApproved: true,
            startDate: {
              lte: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
            },
            endDate: {
              gt: set(new Date(), { hours: 23, minutes: 59, seconds: 59 }),
            },
          },
        },
      ],
      NOT: {
        submission: {
          isApproved: false,
        },
      },
    },
    include: {
      attendance: true,
      submission: true,
    },
  });
  return currentAbsence;
}

export const getAbsenceByNik = async (nik: string) => {
  return await db.absence.findFirst({
    where: { nik },
    include: { attendance: true },
  });
};

export const getAbsenceAll = async () => {
  return await db.absence.findMany({
    include: { attendance: true },
    orderBy: { createdAt: "desc" },
  });
};

// Get All absences
// - From 00:00 AM to 23: 59 PM
// - When status "Izin" or "Sakit" and isApproved is true
// - When date now greater than startDate, and less than endDate
export const getAbsenceTodayAll = async () => {
  return await db.absence.findMany({
    include: { attendance: true, submission: true },
    where: {
      OR: [
        {
          createdAt: {
            gte: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }), // Start
            lte: set(new Date(), { hours: 23, minutes: 59, seconds: 59 }), // End
          },
        },
        {
          status: { in: ["Izin", "Sakit"] },
          createdAt: {
            lte: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
          },
          submission: {
            isApproved: true,
            startDate: {
              lte: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
            },
            endDate: {
              gt: set(new Date(), { hours: 23, minutes: 59, seconds: 59 }),
            },
          },
        },
      ],
      NOT: {
        submission: {
          isApproved: false,
        },
      },
    },
    orderBy: { name: "asc" },
  });
};

export const getAttendanceAll = async () => {
  return await db.absenceAttendance.findMany();
};

export const deleteAttendanceById = async (attendanceId: string) => {
  return await db.absenceAttendance.deleteMany({
    where: { attendanceId },
  });
};

export const deleteAbsenceById = async (id: string) => {
  return await db.absence.delete({
    where: { id },
  });
};
