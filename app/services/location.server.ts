import type { Prisma } from "@prisma/client";
import { db } from "~/lib/db";

export const getTargetLocation = async () => {
  return await db.targetLocation.findFirstOrThrow();
};

type UpdateTargetLocation = Prisma.Args<typeof db.targetLocation, "update">["data"];
export const updateTargetLocationById = async (id: string, payload: UpdateTargetLocation) => {
  return db.targetLocation.update({
    where: { id },
    data: payload,
  });
};
