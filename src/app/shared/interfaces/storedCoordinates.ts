
// use date in seconds
// Math.floor(Date.now() / 1000)
export type StoredCoordinates = [number, google.maps.LatLngLiteral];

export const createStoredCoordinates = (coord: google.maps.LatLngLiteral) => {
    return [Math.floor(Date.now() /1000), coord] as StoredCoordinates;
}

export const storedCoordHasTimeout = (coord: StoredCoordinates, timeoutSeconds: number = 120) => {
    const now = Math.floor(Date.now() /1000);
    return now - coord[0] >= timeoutSeconds;
}
