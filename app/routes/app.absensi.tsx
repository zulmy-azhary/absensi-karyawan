import { type SerializeFrom, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({
    gMapsApiKey: process.env.VERCEL_GOOGLE_MAPS_API_KEY,
    gMapsMapId: process.env.VERCEL_GOOGLE_MAPS_MAP_ID,
  });
}

export type EnvMapType = SerializeFrom<typeof loader>;

export default function AbsensiRoot() {
  const rootLoader = useLoaderData<typeof loader>();
  return <Outlet context={rootLoader} />;
}
