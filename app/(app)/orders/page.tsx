'use client'

import OrderMedicines from "@/meddy/components/OrderMedicines";
import { Button, Chip, Divider, useDisclosure } from "@nextui-org/react"
import { RiMedicineBottleLine } from 'react-icons/ri'

export default () => {
  const { isOpen: isOrderOpen, onOpenChange: onOrderChange, onOpen: onOrderOpen } = useDisclosure();

  return (
    <>
      <div className="flex flex-row items-center justify-between w-full -mt-1 mb-1 bg-purple-50 p-2 rounded-xl">
        <Button 
          isIconOnly 
          variant="flat" 
          className="text-purple-800 bg-purple-100"
          
          onPress={onOrderOpen}
        >
          <RiMedicineBottleLine className="w-6 h-6" />
          <OrderMedicines isOpen={isOrderOpen} onOpenChange={onOrderChange} />
        </Button>
      </div>
      <Divider orientation="horizontal" className="my-2" />
    </>
  )
}