/*
  Warnings:

  - You are about to drop the `MedicineOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MedicineOrder" DROP CONSTRAINT "MedicineOrder_medicine_id_fkey";

-- DropForeignKey
ALTER TABLE "MedicineOrder" DROP CONSTRAINT "MedicineOrder_order_id_fkey";

-- DropTable
DROP TABLE "MedicineOrder";

-- CreateTable
CREATE TABLE "_MedicineToOrder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MedicineToOrder_AB_unique" ON "_MedicineToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_MedicineToOrder_B_index" ON "_MedicineToOrder"("B");

-- AddForeignKey
ALTER TABLE "_MedicineToOrder" ADD CONSTRAINT "_MedicineToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedicineToOrder" ADD CONSTRAINT "_MedicineToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
