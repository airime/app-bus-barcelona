
export const urlTmbApi = "https://api.tmb.cat/v1/";

export type TmbParamsType = {
    app_key: string,
    app_id: string,
    propertyName?: string
  }

  
export interface ITmbPlanParams extends TmbParamsType {
  fromPlace: string,
  toPlace: string,
  date: string,
  time: string,
  arriveBy: string,
  mode: string   
}
