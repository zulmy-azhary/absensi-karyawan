import type { Prisma } from "@prisma/client";

export type ActionType = "DETAIL" | "CREATE" | "UPDATE" | "DELETE";
export type UserType = Omit<Prisma.UserGetPayload<{}>, "password">;