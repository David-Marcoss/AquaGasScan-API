

export interface IMeasurements{
    id: string;
    measure_datetime: Date;
    customer_code: string;
    measure_type: string;
    measure_value: number;
    has_confirmed: boolean;
    image_url: string;
}