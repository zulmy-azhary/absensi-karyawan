import { z } from "zod";

export const absenceSchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
});