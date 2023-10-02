-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "is_automatic" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "is_packs" DROP DEFAULT;
