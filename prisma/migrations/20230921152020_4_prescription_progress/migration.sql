/*
  Warnings:

  - The values [INIT] on the enum `PrescriptionProgress` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PrescriptionProgress_new" AS ENUM ('REQUESTED', 'RECEIVED', 'FILLED');
ALTER TABLE "Prescription" ALTER COLUMN "progress" TYPE "PrescriptionProgress_new" USING ("progress"::text::"PrescriptionProgress_new");
ALTER TYPE "PrescriptionProgress" RENAME TO "PrescriptionProgress_old";
ALTER TYPE "PrescriptionProgress_new" RENAME TO "PrescriptionProgress";
DROP TYPE "PrescriptionProgress_old";
COMMIT;
