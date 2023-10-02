/*
  Warnings:

  - You are about to drop the column `filled` on the `MedicineOrder` table. All the data in the column will be lost.
  - Added the required column `cur_renew` to the `MedicineOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicineOrder" DROP COLUMN "filled",
ADD COLUMN     "cur_renew" INTEGER NOT NULL;
