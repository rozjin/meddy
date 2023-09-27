import { Accordion, AccordionItem, Button, Card, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow } from "@nextui-org/react"
import { RiMedicineBottleLine, RiSearchLine } from "react-icons/ri"
import Form from '@/meddy/components/Form'
import Autocomplete from "@/meddy/components/AutocompleteMedicine"

import { parse } from 'csv-parse';

import { FormEvent, useState } from "react";
import Link from "next/link";

type medicine = {
  id: string,
  chem_id: string,

  name: string,

  formulations: {
      id: string,

      form_id: string,
      pack_id: string,

      name: string,
      brand: string
      unit: string,
      rank: number

      quantity: number
  }[]
};

export default ({ isOpen, onOpenChange } : { isOpen: boolean, onOpenChange: () => void }) => {
  const [ med, setMed ] = useState<medicine>();

  const [ infoOpen, setInfoOpen ] = useState(false);
  const [ medId, setMedId ] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("id", medId)

    const res = await fetch(e.currentTarget.action, {
      method: "POST",
      body: formData,

      redirect: "manual"
    });

    const data = await res.json()
    setMed(data.data)
  }

  return (
    <Modal isOpen={isOpen} onClose={onOpenChange} className="flex flex-col items-start justify-between p-4 text-purple-800 bg-purple-50 ring-purple-800 ring-2">
      <ModalContent>
        <ModalHeader className="flex flex-col items-center justify-between mx-auto">
          <div className="flex flex-row items-center justify-between">
            <RiSearchLine className="w-12 h-12 mt-1 mr-2" />
            <h3 className="text-xl">Search medicines</h3>
          </div>
        </ModalHeader>
        <form className="flex flex-col items-center justify-between mx-auto ring-1 ring-black bg-white rounded-lg pt-4" method="post" onSubmit={onSubmit} action="/api/find">
          <ModalBody className="flex flex-col items-center justify-center">
            <Autocomplete
              isRequired
              isClearable

              name="name"
              type="text"
              placeholder="Estradiol"

              setMedId={setMedId}
            />
            {med != null ? (
              <Card 
                className="flex flex-col items-start w-full max-w-sm justify-between text-purple-700 px-2"
              >
                <ScrollShadow className="max-h-44 w-full bg-transparent border-none">
                  <Accordion isCompact className="mt-2 bg-transparent border-none p-0">
                    {med.formulations.map((form) => (
                      <AccordionItem key={form.id} title={form.name} subtitle={form.brand}
                        classNames={{
                          trigger: "bg-white p-2 rounded-lg",
                          title: "text-purple-700",
                          subtitle: "text-purple-400",
                        }}
                      >
                        <div className="bg-purple-50 flex flex-row items-center justify-between p-2 text-base">
                          <span className="mr-1">Unit: {form.unit}</span>
                          <span>Qty: {form.quantity}</span>
                        </div>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollShadow>
              </Card>
            ) : ( <></> ) }
          </ModalBody>
          <ModalFooter className="flex flex-row items-center justify-center">
            <Button variant="flat" className="bg-purple-800 text-purple-50" size="lg" type="submit">
              <span>Lookup</span>
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}