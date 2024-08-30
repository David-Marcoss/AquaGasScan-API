import * as create from "./Create";
import * as getByCustomerCode from "./GetByCustomerCode"
import * as update from "./Update"



export const MeasurementsController = {
    ...create,
    ...getByCustomerCode,
    ...update,
}