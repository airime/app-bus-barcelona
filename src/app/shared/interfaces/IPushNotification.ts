import { PushNotificationSchema } from "@capacitor/push-notifications";
import { Operador } from "../model/internalInterfaces";
import { LocationType } from "./INamedPlace";

/* en la notificació exportem una posició */
/*
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
            lat: string;
            lng: string;
            locationType?: LocationType;
            operator?: Operador;
            locationName?: string;
            collapse_key: string;
        }
    }
}
*/

export interface IPushNotificationData {
    uniqueId: string;
    title: string;
    subtitle?: string;
    info: string;
    image: string;
    lat: string;
    lng: string;
    locationType?: LocationType;
    operator?: Operador;
    locationName?: string;
}
