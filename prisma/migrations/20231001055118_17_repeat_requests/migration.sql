-- CreateTable
CREATE TABLE "MedicineRepeat" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filled" INTEGER NOT NULL,
    "cur_renew" INTEGER NOT NULL,
    "medicine_id" INTEGER NOT NULL,

    CONSTRAINT "MedicineRepeat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicineRepeat" ADD CONSTRAINT "MedicineRepeat_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
