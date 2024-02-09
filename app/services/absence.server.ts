import { db } from "~/lib/db";
import { set } from "date-fns";
import type { Prisma } from "@prisma/client";

type CreateAbsence = Prisma.Args<typeof db.absence, "create">["data"];
export const createAbsence = async (payload: CreateAbsence) => {
  return await db.absence.create({
    data: payload,
  });
};

type UpdateAbsence = Prisma.Args<typeof db.absence, "update">["data"];
export const updateAbsenceById = async (id: string, payload: UpdateAbsence) => {
  return await db.absence.update({
    where: { id },
    data: payload,
  });
};

export const getAbsenceTodayByNik = async (nik: string) => {
  return await db.absence.findFirst({
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
          createdAt: {
            lte: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
          },
          submission: {
            isApproved: true,
            startDate: {
              lte: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
            },
            endDate: {
              gt: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
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
};

export const getAbsenceByNik = async (nik: string) => {
  return await db.absence.findFirst({
    where: { nik },
    include: { attendance: true },
  });
};

export const getAbsenceById = async (id: string) => {
  return await db.absence.findFirst({
    where: { id },
    include: { attendance: true, submission: true },
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
          createdAt: {
            lte: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
          },
          submission: {
            isApproved: true,
            startDate: {
              lte: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
            },
            endDate: {
              gt: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
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

export const getSubmissionNotApprovedAll = async () => {
  return await db.absence.findMany({
    include: { submission: true },
    where: {
      submission: {
        isApproved: false,
      },
    },
  });
};

export const getAbsenceAllByNik = async (nik: string) => {
  return await db.absence.findMany({
    where: { nik },
    include: { attendance: true, submission: true },
  });
};

export const getAttendanceById = async (attendanceId: string) => {
  return await db.absenceAttendance.findMany({
    where: { attendanceId },
  });
};
