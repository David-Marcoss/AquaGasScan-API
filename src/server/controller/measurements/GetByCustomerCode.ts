import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes"

import * as yup from "yup";
import { validation } from "../../shared/middleware";
import { prisma } from "../../database"
import { IMeasurements } from "../../database/models/measurement";

interface IQueryProps {
  measure_type?: "WATER" | "GAS" | null | undefined;
}

interface IParamsProps {
  customer_code: string;
}

const queryValidation: yup.ObjectSchema<IQueryProps> = yup.object().shape({
  measure_type: yup.string().oneOf(["WATER", "GAS"]).nullable().notRequired(),
});

const paramsValidation: yup.ObjectSchema<IParamsProps> = yup.object().shape({
  customer_code: yup.string().required(),
});

export const getByCustomerCodeValidation = validation({
  query: queryValidation,
  params: paramsValidation,
});

export async function getByCustomerCode(req: Request, res: Response) {

  const { customer_code } = req.params;
  const { measure_type } = req.query;

  let data = []
  if (customer_code)
    data = await prisma.measurements.findMany({
      where: {
        customer_code,
        measure_type: measure_type as "WATER" | "GAS",
      }
    })
  else {
    data = await prisma.measurements.findMany({
      where: {
        customer_code,
      }
    })
  }

  if (data.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error_code: "MEASURES_NOT_FOUND",
      error_description: "Nenhuma leitura encontrada"
    });
  }

  const measures = data.map((measure: IMeasurements) => {
    return {
      measure_uuid: measure.id,
      measure_datetime: measure.measure_datetime,
      measure_type: measure.measure_type,
      has_confirmed: measure.has_confirmed,
      image_url: measure.image_url,
    }
  });

  return res.status(StatusCodes.OK).json({
    customer_code,
    measures: measures,
  });
}
