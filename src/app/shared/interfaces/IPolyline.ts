export interface IPolyline {
    points: google.maps.LatLngLiteral[];
    color: string;
    style: "dotted" | "thin" | "thick"
}
