'use client'

import Form from "@/meddy/components/Form";
import SearchMedicines from "@/meddy/components/SearchMedicines";
import { fetcher } from "@/meddy/hooks/fetcher";
import { Accordion, AccordionItem, Button, Checkbox, Chip, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Popover, PopoverContent, PopoverTrigger, Spinner, useDisclosure } from "@nextui-org/react"
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { RiArrowTurnBackLine, RiCheckLine, RiCloseLine, RiEye2Line, RiFilterLine, RiSearchLine } from "react-icons/ri";
import useSWR from "swr";

export default () => {
  const { isOpen: isSearchOpen, onOpenChange: onSearchChange, onOpen: onSearchOpen } = useDisclosure();
  const { data, mutate, isLoading, error } = useSWR('/api/medicine', fetcher)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch(e.currentTarget.action, {
      method: e.currentTarget.method,
      body: formData,
      redirect: "manual"
    });
    
    try {
      const json = await res.json()
      if (!res.ok) {
        if (json.message) toast.error(json.message)
      } else {
        if (json.message) toast.success(json.message)    
      }
    } catch (err) {
      console.log(`Form failed to parse JSON: ${err}`)
    }

    mutate()
  }

  if (isLoading) return (
    <Spinner
      aria-label="Loading user information"

      color="secondary"
      className="m-auto"

      size="lg"
    />
  )

  return (
    <>
      <div className="flex flex-row items-center justify-between w-full mb-1 -mt-1 bg-purple-50 p-2 rounded-xl">
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
              <div className="flex flex-row justify-between items-center mb-4">
                <span className="text-purple-800 p-2 bg-purple-100 rounded-lg">{medicine.note}</span>
                <div className="flex flex-row justify-between items-center">
                  <form action="/api/medicine" method="POST" onSubmit={onSubmit}>
                    <input type="hidden" name="id" value={medicine.friendly_id} />
                    <input type="hidden" name="op" value="automatic" />
                    <button type="submit">
                      <Checkbox
                        defaultSelected={medicine.is_automatic}

                        color="secondary"
                        classNames={{
                          base: "mr-2 bg-purple-100 rounded-lg",
                          label: "text-purple-800"
                        }}
                      >
                        Automatic Repeat
                      </Checkbox>
                    </button>
                  </form>
                  <Form action="/api/medicine">
                    <input type="hidden" name="id" value={medicine.friendly_id} />
                    <input type="hidden" name="op" value="repeat" />
                    <Button
                      isIconOnly
                      variant="flat"
                      className="text-purple-800 bg-purple-100"

                      type="submit"
                    >
                      <RiArrowTurnBackLine className="w-6 h-6" />
                    </Button>
                  </Form>
                </div>
              </div>
            }
            <div className="flex flex-row justify-between items-center mx-1">
              <span>Next Renewal</span>
              <span>{new Date(medicine.next_renewal).toLocaleString('en-NZ')}</span>
            </div>
            <Divider orientation="horizontal" className="my-2" />
            <div className="flex flex-row justify-between items-center mx-1">
              <span>Repeats</span>
              <span>{medicine.cur_renew} of {medicine.num_renew}</span>
            </div>
            <Divider orientation="horizontal" className="my-2" />
            <div className="flex flex-row justify-between items-center mx-1">
              <span>Prescribing Doctor</span>
              <span>{medicine.prescriber}</span>
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