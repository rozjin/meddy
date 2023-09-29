'use client'

import OrderMedicines from "@/meddy/components/OrderMedicines";
import { Button, Chip, Divider, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@nextui-org/react"
import { RiCheckLine, RiCloseLine, RiEye2Line, RiFilterLine, RiMedicineBottleLine } from 'react-icons/ri'

export default () => {
  const { isOpen: isOrderOpen, onOpenChange: onOrderChange, onOpen: onOrderOpen } = useDisclosure();

  return (
    <>
      <div className="flex flex-row items-center justify-between w-full -mt-1 mb-1 bg-purple-50 p-2 rounded-xl">
        <Popover
          aria-label="Choose View"
          placement="bottom"
        >
          <PopoverTrigger>
            <Button
              isIconOnly
              variant="flat"
              className=" text-purple-800 bg-purple-100"
            >
              <RiFilterLine className="w-6 h-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="px-1 gap-1 flex flex-col items-center justify-center bg-purple-50"
          >
            <Button            
              isIconOnly
              variant="flat"
              className=" text-purple-800 bg-purple-100"
            >
              <RiEye2Line className="w-6 h-6" />
            </Button>
            <Button
              isIconOnly
              variant="flat"
              className=" text-purple-800 bg-purple-100"
            >
              <RiCheckLine className="w-6 h-6" />
            </Button>
            <Button
              isIconOnly
              variant="flat"
              className=" text-purple-800 bg-purple-100"
            >
              <RiCloseLine className="w-6 h-6" />
            </Button>
          </PopoverContent>
        </Popover>
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