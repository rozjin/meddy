'use client'

import SearchMedicines from "@/meddy/components/SearchMedicines";
import { fetcher } from "@/meddy/hooks/fetcher";
import { Accordion, AccordionItem, Button, Chip, Divider, useDisclosure } from "@nextui-org/react"
import { RiSearchLine } from "react-icons/ri";
import useSWR from "swr";

export default () => {
  const { isOpen: isSearchOpen, onOpenChange: onSearchChange, onOpen: onSearchOpen } = useDisclosure();

  const { data, isLoading, error } = useSWR('/api/medicine', fetcher)

  return (
    <>
      <div className="flex flex-row items-center justify-between w-full mb-1 -mt-1 bg-purple-50 p-2 rounded-xl">
        <div className="flex flex-row items-center">
          <span className="mr-4 text-base text-purple-800 font-semibold">Showing:</span>
          <Chip className="text-purple-800 bg-purple-100" size="lg">All</Chip>
        </div>
        <Button
          isIconOnly 
          variant="flat" 
          className="text-purple-800 bg-purple-100"
          
          onPress={onSearchOpen}
        >
          <RiSearchLine className="w-6 h-6" />
          <SearchMedicines isOpen={isSearchOpen} onOpenChange={onSearchChange} />
        </Button>
      </div>
      <Divider orientation="horizontal" className="my-2" />
      <Accordion>
        {!isLoading && (data as any).medicines.map((medicine: any) => (
          <AccordionItem
            classNames={{
              trigger: "bg-white p-2 rounded-lg bg-purple-50",
              title: "text-purple-700",
              subtitle: "text-purple-400",
            }}

            title={`${medicine.name} ${medicine.unit}`}
            subtitle={`Medicine ID: ${medicine.friendly_id}`}
            key={medicine.friendly_id}
          >
            { medicine.note &&
              <div className="flex flex-row justify-start items-center mb-4">
                <span className="text-purple-800 p-2 bg-purple-100 rounded-lg">{medicine.note}</span>
              </div>
            }
            <div className="flex flex-row justify-between items-center mx-1">
              <span>Next Renewal</span>
              <span>{new Date(medicine.next_renewal).toLocaleString('en-NZ')}</span>
            </div>
            <Divider orientation="horizontal" className="my-2" />
            <div className="flex flex-row justify-between items-center mx-1">
              <span>Automatically refill?</span>
              <span>{medicine.is_renew ? "Yes" : "No"}</span>
            </div>
            <Divider orientation="horizontal" className="my-2" />
            <div className="flex flex-row justify-between items-center mx-1">
              <span>Prescribing Doctor</span>
              <span>{medicine.prescriber}</span>
            </div>
            <Divider orientation="horizontal" className="my-2" />
            <div className="flex flex-row justify-between items-center mx-1">
              <span>Quantity left</span>
              <span>{medicine.quantity - medicine.filled} unit{"(s)"}</span>
            </div>
            <Divider orientation="horizontal" className="my-2" />
            <div className="flex flex-row justify-between items-center mx-1">
              <span>Quantity filled</span>
              <span>{medicine.filled} unit{"(s)"}</span>
            </div>
            <Divider orientation="horizontal" className="my-2" />
            <div className="flex flex-row justify-between items-center mx-1">
              <span>MeddyPacks</span>
              <span>{medicine.is_packs ? "Yes" : "No"}</span>
            </div>            
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}