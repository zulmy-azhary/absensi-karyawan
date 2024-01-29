import { type ClassValue, clsx } from "clsx";
import { isWithinInterval, set } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AbsenceState =
  | "Belum Bisa Absen Masuk"
  | "Lakukan Absen Masuk"
  | "Absen Masuk Sudah Lewat"
  | "Belum Bisa Absen Keluar"
  | "Lakukan Absen Keluar"
  | "Absen Keluar Sudah Lewat";

export function absenceState(date: Date): AbsenceState | undefined {
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
