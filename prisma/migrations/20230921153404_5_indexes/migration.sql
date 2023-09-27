/*
  Warnings:

  - You are about to drop the column `friendly_id` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_friendly_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "friendly_id";
