/*
  Warnings:

  - A unique constraint covering the columns `[friendly_id]` on the table `MedicineRepeat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `friendly_id` to the `MedicineRepeat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicineRepeat" ADD COLUMN     "friendly_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MedicineRepeat_friendly_id_key" ON "MedicineRepeat"("friendly_id");
