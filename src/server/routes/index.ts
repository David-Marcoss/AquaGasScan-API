import { Router } from "express";
import { MeasurementsController } from "../controller";
import { upload } from "../shared/middleware";

const router = Router()

router.get("/", (req,res ) => res.send("AquaGasScan-API"))

router.post("/upload", upload.single?.('image'),MeasurementsController.createValidation,MeasurementsController.create)
router.patch("/confirm",MeasurementsController.updateValidation,MeasurementsController.update)
router.get("/:customer_code/list",MeasurementsController.getByCustomerCodeValidation,MeasurementsController.getByCustomerCode)



export {router}