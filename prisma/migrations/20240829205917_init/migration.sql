-- CreateEnum
CREATE TYPE "MeasureType" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "Measurements" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" "MeasureType" NOT NULL,
    "measure_value" DOUBLE PRECISION NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,

    CONSTRAINT "Measurements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Measurements_id_key" ON "Measurements"("id");
