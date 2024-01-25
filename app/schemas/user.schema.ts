import { z } from "zod";

// Create user schema
export const userSchema = z
  .object({
    name: z.string().min(5, "Nama harus setidaknya 5 karakter."),
    nik: z
      .string()
      .min(1, "Nomor Induk Karyawan tidak boleh kosong.")
      .regex(/^[0-9]+$/, "Nomor Induk Karyawan harus berupa angka.")
      .length(9, "Panjang Nomor Induk Karyawan harus 9 digit."),
    password: z
      .string()
      .min(1, "Password tidak boleh kosong.")
      .min(6, "Password setidaknya mengandung 6 karakter.")
      .max(24, "Panjang maksimal password adalah 24 karakter."),
    confirmPassword: z.string().min(1, "Konfirm Password tidak boleh kosong."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Konfirmasi Password tidak cocok.",
    path: ["confirmPassword"],
  });

// Login schema
export const loginSchema = z.object({
  nik: z
    .string()
    .min(1, "Nomor Induk Karyawan tidak boleh kosong.")
    .regex(/^[0-9]+$/, "Nomor Induk Karyawan harus berupa angka.")
    .length(9, "Panjang Nomor Induk Karyawan harus 9 digit."),
  password: z
    .string()
    .min(1, "Password tidak boleh kosong.")
    .min(6, "Password setidaknya mengandung 6 karakter.")
    .max(24, "Panjang maksimal password adalah 24 karakter."),
});

// Update user schema
export const updateUserSchema = z
  .object({
    name: z.string().min(5, "Nama harus setidaknya 5 karakter."),
    nik: z
      .string()
      .min(1, "Nomor Induk Karyawan tidak boleh kosong.")
      .regex(/^[0-9]+$/, "Nomor Induk Karyawan harus berupa angka.")
      .length(9, "Panjang Nomor Induk Karyawan harus 9 digit."),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .partial({ password: true, confirmPassword: true })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Konfirmasi Password tidak cocok.",
    path: ["confirmPassword"],
  });

// User nik schema
export const userNikSchema = z.object({
  nik: z
    .string()
    .min(1, "Nomor Induk Karyawan tidak boleh kosong.")
    .regex(/^[0-9]+$/, "Nomor Induk Karyawan harus berupa angka.")
    .length(9, "Panjang Nomor Induk Karyawan harus 9 digit."),
});

// Delete User Schema
export const deleteUserSchema = z.object({
  nik: z
    .string()
    .min(1, "Nomor Induk Karyawan tidak boleh kosong.")
    .regex(/^[0-9]+$/, "Nomor Induk Karyawan harus berupa angka.")
    .length(9, "Panjang Nomor Induk Karyawan harus 9 digit."),
});
