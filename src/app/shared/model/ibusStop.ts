export interface IiBusResponse<T> {
  status: string,
  data: {ibus: T[]}
}

export interface IiBusRouteStop {
  destination: string,
  'text-ca': string
}

export interface IiBusStop extends IiBusRouteStop {
  line: string,
}
