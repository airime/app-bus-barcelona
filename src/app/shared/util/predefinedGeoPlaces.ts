import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';

export enum geoPlaces { BarcelonaCenter, 
    BarcelonaCiutatVella,
    BarcelonaEixample,
    BarcelonaSants,
    BarcelonaLesCorts,
    BarcelonaSarria,
    BarcelonaGracia,
    BarcelonaHorta,
    BarcelonaNouBarris,
    BarcelonaStAndreu,
    BarcelonaStMarti };

export const PredefinedGeoPositions: Record<geoPlaces, LatLng> = {
    [geoPlaces.BarcelonaCenter]: { lat: 41.38719562452725, lng: 2.170042343172259 },
    [geoPlaces.BarcelonaCiutatVella]: { lat: 41.380237127671805, lng: 2.1752313818505113 },
    [geoPlaces.BarcelonaEixample]: { lat: 41.39399187579082, lng: 2.164702064906218 },
    [geoPlaces.BarcelonaSants]: { lat: 41.3761130410205, lng: 2.135481397190494 },
    [geoPlaces.BarcelonaLesCorts]: { lat: 41.38712941201426, lng: 2.1319819153619943 },
    [geoPlaces.BarcelonaSarria]: { lat: 41.400077619003795, lng: 2.1217253149155355 },
    [geoPlaces.BarcelonaGracia]: { lat: 41.40024407130258, lng: 2.1576520104487935 },
    [geoPlaces.BarcelonaHorta]: { lat: 41.430657684044306, lng: 2.161088512541204 },
    [geoPlaces.BarcelonaNouBarris]: { lat: 41.45157080011613, lng: 2.1762483194703726 },
    [geoPlaces.BarcelonaStAndreu]: { lat: 41.43649915403711, lng: 2.191662183705322 },
    [geoPlaces.BarcelonaStMarti]: { lat: 41.40354477691881, lng: 2.189614654857775 },
};
