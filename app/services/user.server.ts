import { type userSchema } from "~/schemas/user.schema";
import { db } from "~/lib/db";
import type { User } from "@prisma/client";
import type { z } from "zod";
import bcrypt from "bcryptjs";

export const getUsers = async () => {
  return await db.user.findMany({
    where: {
      role: "Karyawan"
    },
  });
};

export const getUserByNik = async (nik: string) => {
  return await db.user.findUnique({
    where: { nik },
  });
};

export const getTotalUsers = async () => {
  return await db.user.count({
    where: {
      role: "Karyawan"
    }
  });
}

export const createUser = async (payload: Omit<z.infer<typeof userSchema>, "confirmPassword">) => {
  return await db.user.create({
    data: payload,
  });
};

export const updateUserByNik = async (nik: string, payload: Partial<User>) => {
  return await db.user.update({
    where: { nik },
    data: payload,
  });
};

export const deleteUserByNik = async (nik: string) => {
  return await db.user.delete({
    where: { nik },
  });
};

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

export const checkPassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};
