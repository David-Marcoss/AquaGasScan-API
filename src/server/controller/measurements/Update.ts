import { Request, Response } from "express";
import * as yup from "yup"
import { StatusCodes } from "http-status-codes"

import { validation } from "../../shared/middleware";
import { IMeasurementsConfirmReq } from "./dto";
import {prisma} from "../../database"



const BodyValidation: yup.Schema<IMeasurementsConfirmReq> =  yup.object().shape({
    measure_uuid: yup.string().required(),
    confirmed_value: yup.number().required()
})

export const updateValidation = validation({
    body: BodyValidation
}) 

export async function update(req: Request<{}, {}, IMeasurementsConfirmReq>, res: Response){

    const {measure_uuid, confirmed_value} = req.body

    const measure = await prisma.measurements.findFirst({
        where: {id: measure_uuid}
    })

    if(!measure){
        return res.status(StatusCodes.NOT_FOUND).json({
            error_code: "MEASURE_NOT_FOUND",
            error_description: "Leitura do mês não realizada"
        })
    }

    if(measure.has_confirmed){
        return res.status(StatusCodes.CONFLICT).json({
            error_code: "CONFIRMATION_DUPLICATE",
            error_description: "Leitura do mês já realizada"
        })
    }

    await prisma.measurements.update({
        where: {id: measure_uuid},
        data: {
            measure_value:confirmed_value,
            has_confirmed: true
        }
    })

    return res.status(StatusCodes.OK).json({success: true})
}