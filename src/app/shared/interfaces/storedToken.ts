export type StoredToken = [number, string];

export const createStoredToken = (token: string) => {
    return [Math.floor(Date.now() /1000), token] as StoredToken;
}

export const storedTokenHasTimeout = (coord: StoredToken, timeoutSeconds: number = 120) => {
    const now = Math.floor(Date.now() /1000);
    return now - coord[0] >= timeoutSeconds;
}
