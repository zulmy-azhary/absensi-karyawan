import {
  GoogleMap,
  type GoogleMapProps,
  useLoadScript,
  type LoadScriptProps,
} from "@react-google-maps/api";
import React, { memo } from "react";

type BaseMapProps = React.PropsWithChildren<{
  loadScript?: Omit<LoadScriptProps, "googleMapsApiKey">;
  id: string;
  gMapsApiKey: string;
  gMapsMapId?: string;
}> &
  GoogleMapProps;

function BaseMap(props: BaseMapProps) {
  const { loadScript, id, gMapsApiKey, gMapsMapId, children, ...rest } = props;
  const { isLoaded } = useLoadScript({
    ...loadScript,
    id,
    googleMapsApiKey: gMapsApiKey,
  });

  return isLoaded ? (
    <GoogleMap
      {...rest}
      zoom={14}
      mapContainerClassName="w-full xl:basis-4/6 h-[60vh] border-2"
      options={{
        mapId: gMapsMapId,
        minZoom: 13,
        maxZoom: 18,
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {children}
    </GoogleMap>
  ) : (
    <Loading />
  );
}

const Loading = () => (
  <div className="w-full h-[50vh] flex justify-center items-center">Loading...</div>
);

export default memo(BaseMap);
