
// Haversine fòrmula
// https://www.joshmorony.com/create-a-nearby-places-list-with-google-maps-in-ionic-2-part-2/
export function getDistanceBetweenPoints(start: google.maps.LatLngLiteral, end: google.maps.LatLngLiteral, units: 'miles' | 'km'): number {
    function toRad(x: number) { return x * Math.PI / 180; }

    let earthRadius = {
        miles: 3958.8,
        km: 6371
    };

    let R = earthRadius[units];
    let lat1 = start.lat;
    let lng1 = start.lng;
    let lat2 = end.lat;
    let lng2 = end.lng;

    let dLat = toRad((lat2 - lat1));
    let dLon = toRad((lng2 - lng1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

}
