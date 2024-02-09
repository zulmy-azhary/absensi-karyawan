/* eslint-disable react-hooks/exhaustive-deps */
import type { MetaFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useOutletContext } from "@remix-run/react";
import { CircleF, MarkerF, PolylineF } from "@react-google-maps/api";
import { memo, useCallback, useState } from "react";
import BaseMap from "~/components/ui/base-map";
import { type EnvMapType } from "~/routes/app.absensi";
import { calculateDistance, absenceState } from "~/lib/utils";
import { getTargetLocation } from "~/services/location.server";
import { Button } from "~/components/ui/button";
import { createAbsenceAction } from "~/actions/absence.server";
import { getAbsenceTodayByNik } from "~/services/absence.server";
import { isKaryawan } from "~/middlewares/auth.middleware";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import type { z } from "zod";
import { absenceSchema } from "~/schemas/absence.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInput } from "~/components/ui/custom-input";
import { CustomForm } from "~/components/ui/custom-form";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await isKaryawan(request);
  const targetInfos = await getTargetLocation();
  const absenceToday = await getAbsenceTodayByNik(user.nik);
  const absenceStateToday = await absenceState(new Date(), absenceToday?.id);

  return { targetInfos, absenceToday, absenceStateToday };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    return await createAbsenceAction(request);
  } catch (error: unknown) {
    return error as Error;
  }
};

export const meta: MetaFunction = () => {
  return [{ title: "Absensi Karyawan | Absensi" }];
};

type GMapType = google.maps.Map;

function Absensi() {
  const { gMapsApiKey, gMapsMapId } = useOutletContext<EnvMapType>();
  const { targetInfos, absenceToday, absenceStateToday } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const infos = targetInfos;
  const targetCoords = { lat: infos.lat, lng: infos.lng };
  const [distance, setDistance] = useState(0);

  const form = useRemixForm<z.infer<typeof absenceSchema>>({
    resolver: zodResolver(absenceSchema),
    defaultValues: targetCoords,
  });

  const onLoad = useCallback((map: GMapType) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const bounds = new window.google.maps.LatLngBounds({ lat: latitude, lng: longitude });

      form.setValue("lat", latitude);
      form.setValue("lng", longitude);

      const distanceResult = calculateDistance({ lat: latitude, lng: longitude }, targetCoords);
      setDistance(distanceResult);
      map.fitBounds(bounds);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Absensi</h2>
      <div className="flex flex-col xl:flex-row gap-x-5">
        {absenceToday?.submission &&
        (absenceToday.submission.status === "Izin" ||
          absenceToday.submission.status === "Sakit") ? (
          <p>Belum dapat melakukan absen dikarenakan izin/sakit.</p>
        ) : (
          <>
            <BaseMap
              gMapsApiKey={gMapsApiKey!}
              gMapsMapId={gMapsMapId!}
              center={form.getValues()}
              onLoad={onLoad}
              id="google-maps-absensi-id"
            >
              <MarkerF
                position={{ lat: form.getValues("lat"), lng: form.getValues("lng") }}
                label={{ text: "Lokasi Saya", className: "-mt-8 font-bold", fontSize: "18px" }}
                options={{ optimized: true }}
              />
              <CircleF
                center={targetCoords}
                options={{
                  radius: infos.radius,
                  fillColor: "#FF0000",
                  fillOpacity: 0.1,
                  strokeColor: "#FF0000",
                  strokeWeight: 0.5,
                  clickable: false,
                }}
              />
              <PolylineF
                path={[form.getValues(), targetCoords]}
                options={{
                  strokeWeight: 1,
                  strokeColor: "#FF0000",
                }}
              />
            </BaseMap>
            <div className="flex flex-col basis-2/6 gap-y-6">
              <div className="">
                <p>Jarak: {distance} meter</p>
                <p>{distance > infos.radius ? "Diluar area kerja." : "Didalam area kerja."}</p>
              </div>
              <RemixFormProvider {...form}>
                <CustomForm
                  actionData={actionData}
                  method="post"
                  action="/app/absensi?index"
                  className="flex flex-col gap-y-6"
                >
                  <CustomInput readOnly label="Latitude" name="lat" />
                  <CustomInput readOnly label="Longitude" name="lng" />
                  <Button
                    type="submit"
                    disabled={
                      distance > infos.radius ||
                      (absenceStateToday !== "Lakukan Absen Masuk" &&
                        absenceStateToday !== "Lakukan Absen Keluar")
                    }
                  >
                    {absenceStateToday}
                  </Button>
                </CustomForm>
              </RemixFormProvider>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(Absensi);
