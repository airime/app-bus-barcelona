
import { Operador } from "../model/internalInterfaces";

export type LocationType = "Parada" | "Estació";

export interface INamedPlace {
    textInfo: string;
    latLng: google.maps.LatLngLiteral;
    locationType?: LocationType;
    operator?: Operador;
    locationName?: string;
}
