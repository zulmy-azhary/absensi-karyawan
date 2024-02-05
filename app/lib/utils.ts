import { type ClassValue, clsx } from "clsx";
import { isWithinInterval, set } from "date-fns";
import { twMerge } from "tailwind-merge";
import { getAttendanceById } from "~/services/absence.server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type CurrentPositionType = google.maps.LatLngLiteral;
type TargetPositionType = google.maps.LatLngLiteral;

export function calculateDistance(
  currentPosition: CurrentPositionType,
  targetPosition: TargetPositionType
): number {
  // Konversi derajat ke radian
  let lat1 = (currentPosition.lat * Math.PI) / 180;
  let lng1 = (currentPosition.lng * Math.PI) / 180;
  let lat2 = (targetPosition.lat * Math.PI) / 180;
  let lng2 = (targetPosition.lng * Math.PI) / 180;

  // Haversine Formula
  let distanceLat = Math.abs(lat2 - lat1);
  let distanceLng = Math.abs(lng2 - lng1);
  let a =
    Math.pow(Math.sin(distanceLat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(distanceLng / 2), 2);

  let calculate = 2 * Math.asin(Math.sqrt(a));

  // Radius bumi, 6371 KM
  let radius = 6371;
  let distanceKm = calculate * radius;

  return Math.round(distanceKm * 1000);
}


type AbsenceState =
  | "Belum Bisa Absen Masuk"
  | "Lakukan Absen Masuk"
  | "Sudah Absen Masuk"
  | "Absen Masuk Sudah Lewat"
  | "Belum Bisa Absen Keluar"
  | "Lakukan Absen Keluar"
  | "Sudah Absen Keluar"
  | "Absen Keluar Sudah Lewat";

export async function absenceState(date: Date, absenceId?: string): Promise<AbsenceState | undefined> {
  const attendanceToday = await getAttendanceById(absenceId ?? "");
  //* Jika waktu sekarang belum jam 08:00AM (00:01AM - 07:59AM), maka belum dapat melakukan absen masuk.
  const isAbsenceInNotReadyYet = isWithinInterval(date, {
    start: set(date, { hours: 0, minutes: 0 }),
    end: set(date, { hours: 7, minutes: 59 }),
  });
  if (isAbsenceInNotReadyYet) {
    return "Belum Bisa Absen Masuk";
  }

  //* Jika waktu antara 08:00AM dan 09:00AM (08:00AM - 08:59AM), maka sudah dapat melakukan absen masuk.
  const isAbsenceIn = isWithinInterval(date, {
    start: set(date, { hours: 8, minutes: 0 }),
    end: set(date, { hours: 8, minutes: 59 }),
  });
  if (isAbsenceIn) {
    if (attendanceToday.find(attendance => attendance.status === "Masuk")) {
      return "Sudah Absen Masuk";
    }
    return "Lakukan Absen Masuk";
  }

  //* Jika waktu sudah lewat dari jam 09:00AM atau sebelum jam 12:00PM (09:00AM - 11:59AM), absen masuk sudah tidak bisa dilakukan.
  const isPastAbsenceIn = isWithinInterval(date, {
    start: set(date, { hours: 9, minutes: 0 }),
    end: set(date, { hours: 11, minutes: 59 }),
  });
  if (isPastAbsenceIn) {
    return "Absen Masuk Sudah Lewat";
  }

  //* Jika waktu antara jam 12:00PM dan jam 17:00PM (12:00PM - 16:59PM), absen keluar belum bisa dilakukan.
  const isAbsenceOutNotReadyYet = isWithinInterval(date, {
    start: set(date, { hours: 12, minutes: 0 }),
    end: set(date, { hours: 16, minutes: 59 }),
  });
  if (isAbsenceOutNotReadyYet) {
    return "Belum Bisa Absen Keluar";
  }

  //* Jika waktu antara 17:00PM dan 22:00PM (17:00PM - 21:59PM), maka sudah dapat melakukan absen keluar.
  const isAbsenceOut = isWithinInterval(date, {
    start: set(date, { hours: 17, minutes: 0 }),
    end: set(date, { hours: 21, minutes: 59 }),
  });
  if (isAbsenceOut) {
    if (attendanceToday.find((attendance) => attendance.status === "Keluar")) {
      return "Sudah Absen Keluar";
    }
    return "Lakukan Absen Keluar";
  }

  //* Jika waktu sudah lewat dari jam 22:00PM (22:00PM - 23:59PM), maka absen keluar sudah tidak bisa dilakukan.
  const isPastAbsenceOut = isWithinInterval(date, {
    start: set(date, { hours: 22, minutes: 0 }),
    end: set(date, { hours: 23, minutes: 59 }),
  });
  if (isPastAbsenceOut) {
    return "Absen Keluar Sudah Lewat";
  }
}
