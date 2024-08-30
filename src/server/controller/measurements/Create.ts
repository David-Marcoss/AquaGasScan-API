import * as yup from 'yup';
import { startOfMonth, endOfMonth } from 'date-fns';
import { StatusCodes } from "http-status-codes"
import { Request, Response } from 'express';
import { validation } from '../../shared/middleware';
import { analyzeImage } from '../../shared/service';
import { prisma } from '../../database';

import { IMeasurementsUploadReq, IMeasurementsUploadRes} from './dto';

// Esquema de validação de dados
const bodyValidation: yup.Schema<Omit<IMeasurementsUploadReq, 'id'>> = yup.object().shape({
  image: yup.string().required(),
  customer_code: yup.string().required(),
  measure_datetime: yup.date().required(),
  measure_type: yup.string().oneOf(['WATER', 'GAS']).required(),
});


export const createValidation = validation({
  body: bodyValidation,
});

export async function create(req: Request<{}, {}, IMeasurementsUploadReq>, res: Response){
  try {
    let { customer_code, measure_datetime, measure_type } = req.body;
    const image = req.file;

    if (!image)
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Arquivo de imagem não fornecido, enviar dados no formato multipart/form-data",
      });
    

    // Definir início e fim do mês a partir da data fornecida
    const startOfCurrentMonth = startOfMonth(new Date(measure_datetime));
    const endOfCurrentMonth = endOfMonth(new Date(measure_datetime));

    // Verificar se já existe uma leitura do mesmo tipo no mês atual

    measure_datetime = new Date(measure_datetime);

    const measureExists = await prisma.measurements.findFirst({
      where: {
        customer_code,
        measure_type,
        measure_datetime: {
          gte: startOfCurrentMonth, // Data maior ou igual ao início do mês
          lte: endOfCurrentMonth,   // Data menor ou igual ao fim do mês
        },
      },
    });

    if (measureExists) {
      return res.status(StatusCodes.CONFLICT).json({
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já foi realizada",
       });
    }

    const measure_value = await analyzeImage(image.path, image.mimetype, measure_type) as number;

    const data = await prisma.measurements.create({
      data: {
        customer_code, 
        measure_value,
        measure_datetime,
        image_url: "http://localhost:3000/" + image.path,
        measure_type,
        has_confirmed: false,
      },
    });

    const response: IMeasurementsUploadRes = {
      image_url: data.image_url,
      measure_value: data.measure_value,
      measure_uuid: data.id,
    };

    res.status(StatusCodes.OK).json(response);

  } catch (error: Error | any) {
    console.error('Error creating measurement:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error_code: "Server Error",
        error_description: error.message || "Internal server error",
    });
  }
}

