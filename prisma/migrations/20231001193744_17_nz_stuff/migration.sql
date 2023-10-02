/*
  Warnings:

  - You are about to drop the column `filled` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `filled` on the `MedicineRepeat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "filled",
DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "MedicineRepeat" DROP COLUMN "filled";
