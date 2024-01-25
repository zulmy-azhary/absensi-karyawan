import { addDays } from "date-fns";
import { z } from "zod";

const pengajuanEnum = ["Sakit", "Izin"] as const;

export const pengajuanSchema = z.object({
  title: z.enum(pengajuanEnum, {
    errorMap: () => ({ message: "Judul pengajuan tidak boleh kosong." }),
  }),
  date: z.object(
    {
      from: z.coerce.date().refine((data) => data >= addDays(new Date(), -1), {
        message: "Tanggal pengajuan sudah tidak valid.",
      }),
      to: z.coerce.date(),
    },
    { errorMap: () => ({ message: "Tanggal pengajuan tidak boleh kosong." }) }
  ),
  description: z.string().min(1, "Keterangan tidak boleh kosong."),
});
