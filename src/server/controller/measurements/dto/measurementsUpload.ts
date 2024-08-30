
// interface para request mensurements/upload
export interface IMeasurementsUploadReq{
    image: string; 
    customer_code: string; 
    measure_datetime: Date; 
    measure_type: 'WATER' | 'GAS';
}
  

export interface IMeasurementsUploadRes {
    image_url: string,
    measure_value: number,
    measure_uuid: string
}
