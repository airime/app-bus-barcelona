import { Operador } from "../model/internalInterfaces";
import { LocationType } from "./INamedPlace";

/* en la notificació exportem una posició */
export interface IPushNotification {
    actionId: string;
    notification: {
        id: string;
        data: {
            google: {
                delivered_priority: string;
                original_priority: string;
            },
            textInfo: string;
            lat: number;
            lng: number;
            locationType?: LocationType;
            operator?: Operador;
            locationName?: string;
            collapse_key: string;
        }
    }
}
