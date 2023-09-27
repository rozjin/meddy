/*
  Warnings:

  - The `pictures` column on the `Prescription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "pictures",
ADD COLUMN     "pictures" TEXT[];
