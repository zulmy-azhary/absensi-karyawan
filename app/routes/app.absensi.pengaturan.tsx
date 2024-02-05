/* eslint-disable react-hooks/exhaustive-deps */
import { CircleF } from "@react-google-maps/api";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useOutletContext } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import BaseMap from "~/components/ui/base-map";
import { isAdmin } from "~/middlewares/auth.middleware";
import { type EnvMapType } from "~/routes/app.absensi";
import { Button } from "~/components/ui/button";
import { updateTargetLocation } from "~/actions/location.server";
import { getTargetLocation } from "~/services/location.server";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import type { z } from "zod";
import { locationSchema } from "~/schemas/location.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInput } from "~/components/ui/custom-input";
import { CustomForm } from "~/components/ui/custom-form";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await isAdmin(request);
  const targetLocation = await getTargetLocation();
  return targetLocation;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    return await updateTargetLocation(request);
  } catch (error: unknown) {
    return error as Error;
  }
};

export const meta: MetaFunction = () => {
  return [{ title: "Absensi Karyawan | Pengaturan Lokasi" }];
};

type GMapType = google.maps.Map;

export default function SettingLokasi() {
  const { gMapsApiKey, gMapsMapId } = useOutletContext<EnvMapType>();
  const targetInfos = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { createdAt, updatedAt, ...defaultValues } = targetInfos;
  const [infos, setInfos] = useState(targetInfos);
  const [isEditable, setEditable] = useState(false);

  const form = useRemixForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    mode: "onChange",
    values: defaultValues,
  });

  const onLoad = useCallback((map: GMapType) => {
    const { lat, lng } = infos;
    const bounds = new google.maps.LatLngBounds({ lat, lng });

    map.fitBounds(bounds);
  }, []);

  useEffect(() => {
    setInfos(targetInfos);
  }, [targetInfos]);

  useEffect(() => {
    if (isEditable) return;
    setInfos(targetInfos);
  }, [isEditable]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Pengaturan Lokasi</h2>
      <div className="flex flex-col xl:flex-row gap-x-5 gap-y-8">
        <BaseMap
          id="google-maps-settings-id"
          gMapsApiKey={gMapsApiKey!}
          gMapsMapId={gMapsMapId!}
          center={{ lat: infos.lat, lng: infos.lng }}
          onLoad={onLoad}
        >
          <CircleF
            center={{ lat: form.getValues("lat"), lng: form.getValues("lng") }}
            options={{
              radius: form.getValues("radius"),
              fillColor: "#FF0000",
              fillOpacity: 0.1,
              strokeColor: "#FF0000",
              strokeWeight: 0.5,
              draggable: isEditable,
            }}
            onDragEnd={(e) => {
              form.setValue("lat", e.latLng!.lat());
              form.setValue("lng", e.latLng!.lng());
            }}
          />
        </BaseMap>
        <RemixFormProvider {...form}>
          <CustomForm
            actionData={actionData}
            method="post"
            className="flex flex-col gap-y-6 basis-2/6"
            onSubmit={(e) => {
              form.handleSubmit(e);
              if (form.formState.isValid) {
                setEditable(false);
              }
            }}
          >
            <CustomInput
              label="Nama Lokasi"
              name="name"
              placeholder="Masukkan nama lokasi..."
              disabled={!isEditable}
            />
            <CustomInput
              label="Latitude"
              name="lat"
              placeholder="Masukkan latitude..."
              disabled={!isEditable}
              readOnly
            />
            <CustomInput
              label="Longitude"
              name="lng"
              placeholder="Masukkan longitude..."
              disabled={!isEditable}
              readOnly
            />
            <CustomInput
              label="Radius (meter)"
              name="radius"
              placeholder="Masukkan radius..."
              value={infos.radius}
              onChange={(e) => {
                setInfos((prev) => ({ ...prev, radius: Number(e.target.value) }));
                form.setValue("radius", Number(e.target.value));
              }}
              disabled={!isEditable}
            />
            {isEditable ? (
              <div className="flex justify-end gap-x-4">
                <Button
                  type="button"
                  onClick={() => {
                    setEditable(false);
                    form.reset();
                  }}
                  variant="destructive"
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary">
                  Simpan Perubahan
                </Button>
              </div>
            ) : (
              <Button type="button" onClick={() => setEditable(true)}>
                Ubah
              </Button>
            )}
          </CustomForm>
        </RemixFormProvider>
      </div>
    </div>
  );
}
