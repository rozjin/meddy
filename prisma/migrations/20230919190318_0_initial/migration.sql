-- CreateEnum
CREATE TYPE "OrderProgress" AS ENUM ('PREPARING', 'CONSULT', 'SHIPPED', 'TRANSIT', 'DELIVERED');

-- CreateEnum
CREATE TYPE "PrescriptionMethod" AS ENUM ('UPLOAD', 'MAIL', 'FAX');

-- CreateEnum
CREATE TYPE "PrescriptionProgress" AS ENUM ('INIT', 'REQUESTED', 'RECEIVED', 'FILLED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "friendly_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "dob" TIMESTAMP(3),
    "gender" TEXT,
    "phone_number" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "friendly_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiry" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "friendly_id" TEXT NOT NULL,
    "nhi" TEXT NOT NULL,
    "otc" TEXT[],
    "is_allergic" BOOLEAN NOT NULL DEFAULT false,
    "proof_id" TEXT[],
    "address" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allergy" (
    "id" SERIAL NOT NULL,
    "trigger" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "patient_id" INTEGER NOT NULL,

    CONSTRAINT "Allergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" SERIAL NOT NULL,
    "friendly_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_renew" BOOLEAN NOT NULL DEFAULT false,
    "prescriber" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "filled" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "is_packs" BOOLEAN NOT NULL DEFAULT false,
    "next_renewal" TIMESTAMP(3) NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "prescription_id" INTEGER NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "friendly_id" TEXT NOT NULL,
    "method" "PrescriptionMethod" NOT NULL,
    "progress" "PrescriptionProgress" NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "pictures" TEXT[],
    "patient_id" INTEGER NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicineOrder" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "filled" INTEGER NOT NULL,
    "medicine_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,

    CONSTRAINT "MedicineOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "friendly_id" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "delivered" TIMESTAMP(3) NOT NULL,
    "ask_consult" BOOLEAN NOT NULL DEFAULT false,
    "is_consult" BOOLEAN NOT NULL DEFAULT false,
    "progress" "OrderProgress" NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_friendly_id_key" ON "User"("friendly_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_friendly_id_key" ON "Session"("friendly_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "Session"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_friendly_id_key" ON "Patient"("friendly_id");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_nhi_key" ON "Patient"("nhi");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_friendly_id_key" ON "Medicine"("friendly_id");

-- CreateIndex
CREATE UNIQUE INDEX "Prescription_friendly_id_key" ON "Prescription"("friendly_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_friendly_id_key" ON "Order"("friendly_id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allergy" ADD CONSTRAINT "Allergy_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineOrder" ADD CONSTRAINT "MedicineOrder_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineOrder" ADD CONSTRAINT "MedicineOrder_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
