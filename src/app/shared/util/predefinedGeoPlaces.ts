export enum geoPlaces {
    BarcelonaCenter,
    BarcelonaBus1210,
    BarcelonaBus1257,
    BarcelonaBus1271
  };

export const PredefinedGeoPositions: Record<geoPlaces, google.maps.LatLngLiteral> = {
    [geoPlaces.BarcelonaCenter]: { lat: 41.38719562452725, lng: 2.170042343172259 },
    [geoPlaces.BarcelonaBus1210]: { lat: 41.38775693, lng: 2.16931623 },
    [geoPlaces.BarcelonaBus1257]: { lat: 41.38772685, lng: 2.17054692 },
    [geoPlaces.BarcelonaBus1271]: { lat: 41.38655188, lng: 2.16952516 }
};
