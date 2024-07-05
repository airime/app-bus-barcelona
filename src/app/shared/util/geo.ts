import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';

// Haversine fòrmula
export function getDistanceBetweenPoints(start: LatLng, end: LatLng, units: 'miles' | 'km'): number {
    function toRad(x: number) { return x * Math.PI / 180; }

    let earthRadius = {
        miles: 3958.8,
        km: 6371
    };

    let R = earthRadius[units];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = toRad((lat2 - lat1));
    let dLon = toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

}