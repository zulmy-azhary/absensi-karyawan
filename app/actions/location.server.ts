import { zodResolver } from "@hookform/resolvers/zod";
import { json } from "@remix-run/node";
import { AuthorizationError } from "remix-auth";
import { parseFormData, validateFormData } from "remix-hook-form";
import type { z } from "zod";
import { locationSchema } from "~/schemas/location.schema";
import { updateTargetLocationById } from "~/services/location.server";

export async function updateTargetLocation(request: Request) {
  // Validate user's input
  const { data, errors } = await validateFormData<z.infer<typeof locationSchema>>(
    await parseFormData(request),
    zodResolver(locationSchema)
  );

  if (errors) {
    throw new AuthorizationError("Input tidak valid.");
  }

  try {
    await updateTargetLocationById(data.id, data);
    return json({ status: 200, message: "Berhasil menyimpan perubahan lokasi." }, { status: 200 });
  } catch {
    return json({ status: 500, message: "Gagal menyimpan perubahan. Silahkan coba lagi." }, { status: 500 });
  }
}
