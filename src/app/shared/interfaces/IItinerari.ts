import { retry } from "rxjs";
import { INamedPlace } from "./INamedPlace";
import { IPolyline } from "./IPolyline";


export interface IShareableData {
    place: INamedPlace;
    mode: string;
    arrivalTime: string;
}


export type ModeEtapa = "WALK" | "SUBWAY" | "RAIL" | "BUS" | "TRAM";

export interface IItinerari {
    duration: number;
    endTime: number;
    walkTime: number;
    transitTime: number;
    waitingTime: number;
    walkDistance: number;
    tooSloped: boolean;
    etapes: IEtapa[];
}

export interface IEtapa {
    distance: number,
    mode: ModeEtapa,
    from: INamedPlace,
    to: INamedPlace,
    routeShortName: string,
    routeLongName: string,
    routeColor: string,
    steps: google.maps.LatLngLiteral[], //empty array
    intermediateStops?: INamedPlace[],
}

export function convertPlan(value: any[]): IItinerari[] {
    console.log(value);
    let result: IItinerari[] = [];
    for (let i = 0; i < value.length; i++) {
        result.push(convertItinerari(value[i]));
    }
    result.sort((x, y) => { return x.duration < y.duration ? -1 : 1 })
    return result;
}

export function textModeEtapa(value: ModeEtapa) {
    switch (value) {
        case "WALK": return "CAMINANT";
        case "SUBWAY": return "METRO";
        case "RAIL": return "TREN";
        case "BUS": return "BUS";
        case "TRAM": return "TRAM";
    }
}

export function modesItinerari(value: IItinerari) {
    let modesArray: string[] = [];
    let modes: Set<ModeEtapa> = new Set<ModeEtapa>();
    value.etapes.forEach(x => { modes.add(x.mode) });
    for (let item of modes) modesArray.push(textModeEtapa(item));
    return modesArray.join(", ");
}

export function descriuItinerari(value: IItinerari) {
    let minutes = Math.ceil(value.duration / 60);
    let hores = Math.floor(minutes / 60);
    minutes = minutes % 60;
    const strTemps = (hores > 0 ? hores.toString() + "h " : "") + minutes.toString().padStart(2, '0') + "'"
    return `Durada: ${strTemps} mode: ${modesItinerari(value)}`
}

export function getPolylines(from: google.maps.LatLngLiteral,
                             to: google.maps.LatLngLiteral,
                             value: IItinerari) {
    let result: IPolyline[] = [];

    function getPolyline(value: IEtapa, firstPoint?: google.maps.LatLngLiteral) {
        let pEtapa: google.maps.LatLngLiteral[] = [];
        if (!!firstPoint) {
            pEtapa.push({ lat:firstPoint.lat, lng:firstPoint.lng });
        }
        if (!!value.intermediateStops) {
            for (let i = 0; i < value.intermediateStops.length; i++) {
                pEtapa.push({lat:value.intermediateStops[i].latLng.lat, lng:value.intermediateStops[i].latLng.lng});
            }
        } else {
            for (let i = 0; i < value.steps.length; i++) {
                pEtapa.push({lat:value.steps[i].lat, lng:value.steps[i].lng});
            }
        }
        return pEtapa;
    }

    function polyLineEtapa(p: google.maps.LatLngLiteral[], e: IEtapa) {
        return <IPolyline>{
            points: p,
            color: e.routeColor,
            style: e.mode == 'WALK' ? 'dotted'
                 : e.mode == 'BUS' ? 'thin'
                 : 'thick'
        }
    }
    let p1: google.maps.LatLngLiteral[] = [{lat:from.lat, lng:from.lng}, ...getPolyline(value.etapes[0])];
    if (value.etapes.length > 1) {
        result.push(polyLineEtapa(p1, value.etapes[0]));
        for (let i = 1; i < value.etapes.length - 1; i++) {
            result.push(polyLineEtapa(getPolyline(value.etapes[i]), value.etapes[i]));
        }
        const pn: google.maps.LatLngLiteral[] = [...getPolyline(value.etapes[value.etapes.length - 1]), {lat:to.lat, lng:to.lng}];
        result.push(polyLineEtapa(pn, value.etapes[0]));
    } else {
        p1 = [...p1, {lat:to.lat, lng:to.lng}]
        result.push(polyLineEtapa(p1, value.etapes[0]));
    }
    return result;
}

//Note it's not exported
function convertItinerari(value: any): IItinerari {

    function convertEtapes(value: any): IEtapa[] {

        function convertEtapa(value: any): IEtapa {

            function toINamedPlace(value: any) {

                function namespaceToOperator(value: string) {
                    if (!!value) {
                        switch (value) {
                            case "fgc": return "FGC";
                            case "bus": return "TB";
                            case "tbaix": return "TRAM";
                            default: return undefined;
                        }
                    } else return undefined;
                }

                let ret: INamedPlace = {
                    info: value.name,
                    latLng: { lat: value.lat, lng: value.lon }
                }
                if (value.transitNamespaceElement) {
                    ret.operator = namespaceToOperator(value.transitNamespaceElement);
                }
                return ret;

            }

            function convertSteps(value: any): google.maps.LatLngLiteral[] {
                function convertStep(value: any): google.maps.LatLngLiteral {
                    return <google.maps.LatLngLiteral>{ lat: value.lat, lng: value.lon }
                }
                let result: google.maps.LatLngLiteral[] = [];
                for (let i = 0; i < value.length; i++) {
                    result.push(convertStep(value[i]));
                }
                return result;
            }

            function convertIntermediateStops(value: any): INamedPlace[] {
                let result: INamedPlace[] = [];
                for (let i = 0; i < value.length; i++) {
                    result.push(toINamedPlace(value[i]));
                }
                return result;
            }

            let result: IEtapa = {
                distance: <number>value.distance,
                mode: <ModeEtapa>value.mode,
                from: toINamedPlace(value.from),
                to: toINamedPlace(value.to),
                routeShortName: value.routeShortName,
                routeLongName: value.routeLongName,
                routeColor: value.routeColor,
                steps: convertSteps(value.steps),
            }
            if (!!value.intermediateStops) {
                result.intermediateStops = convertIntermediateStops(value.intermediateStops);
            }
            return result;
        }

        let result: IEtapa[] = [];
        for (let i = 0; i < value.length; i++) {
            result.push(convertEtapa(value[i]));
        }
        return result;
    }
    return {
        duration: value.duration,
        endTime: value.endTime,
        walkTime: value.walkTime,
        transitTime: value.transitTime,
        waitingTime: value.waitingTime,
        walkDistance: value.walkDistance,
        tooSloped: value.tooSloped,
        etapes: convertEtapes(value.legs)
    }
}
