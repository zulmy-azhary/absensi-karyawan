import { z } from "zod";

export const locationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nama lokasi tidak boleh kosong."),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  radius: z.coerce.number().gte(10, "Radius minimal 10 meter.").lte(1000, "Radius maksimal 1 km.")
})