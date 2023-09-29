'use client'

import { Button, Divider, useDisclosure } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { RiHeart3Line, RiMedicineBottleLine, RiPassportLine, RiUser3Line } from 'react-icons/ri'

export default ({ children } : { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row items-center justify-start w-full -mt-1 mb-1 bg-purple-50 p-2 rounded-xl">
        <Button 
          isIconOnly 
          variant="flat" 
          className="text-purple-800 bg-purple-100"

          onPress={() => router.push("/settings/user")}
        >
          <RiUser3Line className="w-6 h-6" />
        </Button>
        <Button 
          isIconOnly 
          variant="flat" 
          className="text-purple-800 bg-purple-100 ml-2"

          onPress={() => router.push("/settings/health")}
        >
          <RiHeart3Line className="w-6 h-6" />
        </Button>
        <Button 
          isIconOnly 
          variant="flat" 
          className="text-purple-800 bg-purple-100 ml-auto"

          onPress={() => router.push("/settings/identity")}
        >
          <RiPassportLine className="w-6 h-6" />
        </Button>
      </div>
      <Divider orientation="horizontal" className="my-2" />
      {children}
    </>
  )
}