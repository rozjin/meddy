'use client'

import OrderMedicines from "@/meddy/components/OrderMedicines";
import { fetcher } from "@/meddy/hooks/fetcher";
import { Accordion, AccordionItem, Button, Chip, Divider, Listbox, ListboxItem, Modal, ModalBody, ModalContent, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@nextui-org/react"
import { useState } from "react";
import { RiCheckLine, RiCloseLine, RiEye2Line, RiFilterLine, RiMedicineBottleLine, RiSearch2Line } from 'react-icons/ri'
import useSWR from "swr";

export default () => {
  const { isOpen: isPlaceOrderOpen, onOpenChange: onPlaceOrderChange, onOpen: onPlaceOrderOpen } = useDisclosure();
  const { data, isLoading, error }:
    { data: any, isLoading: boolean, error: unknown } = useSWR('/api/order', fetcher)

  const [ isOrdersOpen, setOrdersOpen ] = useState<boolean[]>([])
  const isOrderOpen = (idx: number) => isOrdersOpen.length > idx ? isOrdersOpen[idx] : false;
  const toggleOrderOpen = (idx: number) => () => setOrdersOpen(prev => {
    const newOrdersOpen = [...prev];
    newOrdersOpen[idx] = !newOrdersOpen[idx]

    return newOrdersOpen
  })

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

          onPress={onPlaceOrderOpen}
        >
          <RiMedicineBottleLine className="w-6 h-6" />
          <OrderMedicines isOpen={isPlaceOrderOpen} onOpenChange={onPlaceOrderChange} />
        </Button>
      </div>
      <Divider orientation="horizontal" className="my-2" />
      <Accordion>
        { !isLoading && data.orders.map((order: any, idx: number) => (
          <AccordionItem
            classNames={{
              trigger: "bg-white p-2 rounded-lg bg-purple-50",
              title: "text-purple-700",
              subtitle: "text-purple-400",
            }}

            title={order.medicines.map((medicine: any) => medicine.name).join(", ")}
            subtitle={`Order ID: ${order.friendly_id}`}

            key={order.friendly_id}
          >
            <div className="flex flex-col">
              <div className="flex flex-row justify-between items-center">
                <span className="text-purple-800 bg-purple-100 p-2 rounded-lg">
                  {{
                    "PREPARING": "Your order is being prepared",
                    "CONSULT": "Your pharmacist has contacted you for a consult",

                    "SHIPPED": "Your order is being shipped",
                    "TRANSIT": "Your order is in transit. It will be with you shortly",

                    "DELIVERED": "Your order has been delivered. Thank you for using Meddy",

                    "CANCELLED": "Your order was cancelled"
                  }[order.progress as string]}
                </span>
                <Button
                  isIconOnly
                  variant="flat"
                  className="text-purple-800 bg-purple-100"

                  onPress={toggleOrderOpen(idx)}
                >
                  <RiSearch2Line className="w-6 h-6" />
                </Button>
              </div>
              <Divider orientation="horizontal" className="mb-2 mt-4" />
              <div className="flex flex-row justify-between items-center mx-1">
                <span>Created On</span>
                <span>{new Date(order.created).toLocaleDateString("en-NZ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}</span>
              </div>
              <Modal isOpen={isOrderOpen(idx)} onClose={toggleOrderOpen(idx)} className="flex flex-col items-start justify-between p-4 text-purple-800 bg-purple-50 ring-purple-800 ring-2">
                <ModalContent>
                  <ModalBody>
                    {order.progress != "CANCELLED" ?
                      <Accordion>
                        <AccordionItem
                          classNames={{
                            trigger: "bg-white p-2 rounded-lg bg-purple-50",
                            title: "text-purple-700",
                            subtitle: "text-purple-400",
                          }}

                          isDisabled={!(order.progress == "PREPARING")}

                          title="Preparing"
                          subtitle={`Your order is being prepared ${order.is_consult ? "A pharmacist will contact you shortly" : "Your order will be ready shortly"}`}
                        >

                        </AccordionItem>
                        <AccordionItem
                          classNames={{
                            trigger: "bg-white p-2 rounded-lg bg-purple-50",
                            title: "text-purple-700",
                            subtitle: "text-purple-400",
                          }}

                          isDisabled={!(order.progress == "CONSULT")}

                          title="Consult"
                          subtitle="A pharmacist has contacted you to discuss your medication"
                        >

                        </AccordionItem>
                        <AccordionItem
                          classNames={{
                            trigger: "bg-white p-2 rounded-lg bg-purple-50",
                            title: "text-purple-700",
                            subtitle: "text-purple-400",
                          }}

                          isDisabled={!(order.progress == "SHIPPED")}

                          title="Shipped"
                          subtitle="Your order has been shipped. A tracking link will be available shortly"
                        >

                        </AccordionItem>
                        <AccordionItem
                          classNames={{
                            trigger: "bg-white p-2 rounded-lg bg-purple-50",
                            title: "text-purple-700",
                            subtitle: "text-purple-400",
                          }}

                          isDisabled={!(order.progress == "TRANSIT")}

                          title="Transit"
                          subtitle="Your order is in transit and is with NZPost, our trusted partner"
                        >

                        </AccordionItem>
                        <AccordionItem
                          classNames={{
                            trigger: "bg-white p-2 rounded-lg bg-purple-50",
                            title: "text-purple-700",
                            subtitle: "text-purple-400",
                          }}

                          isDisabled={!(order.progress == "DELIVERED")}

                          title="Delivered"
                          subtitle="Your order was delivered. Thank you for using Meddy"
                        >

                        </AccordionItem>
                      </Accordion>
                    :
                      <Accordion>
                        <AccordionItem
                          classNames={{
                            trigger: "bg-white p-2 rounded-lg bg-purple-50",
                            title: "text-purple-700",
                            subtitle: "text-purple-400",
                          }}

                          title="Order"
                          subtitle="Order cancelled. Please contact the pharmacist for more information"
                        ></AccordionItem>
                      </Accordion>
                    }
                    <Divider orientation="horizontal" />
                    <h4 className="-mb-2">Medicines</h4>
                    <Accordion>
                      {order.medicines.map((medicine: any, idx: number) => (
                        <AccordionItem
                          classNames={{
                            trigger: "bg-white p-2 rounded-lg bg-purple-50",
                            title: "text-purple-700",
                            subtitle: "text-purple-400",
                          }}

                          title={medicine.name}
                          subtitle={`Repeats left: ${medicine.num_renew - medicine.cur_renew} of ${medicine.num_renew}`}

                          key={idx}

                          hideIndicator
                        >
                        </AccordionItem>
                      ))}
                    </Accordion>
                    <Divider orientation="horizontal" />
                    <div className="flex flex-row justify-start items-center">
                      <h4>Shipping Address</h4>
                      <span className="ml-2 text-purple-400">{order.address}</span>
                    </div>
                    <Divider orientation="horizontal" />
                    <div className="flex flex-row justify-start items-center">
                      <h4>Expected Delivery Date</h4>
                      <span className="ml-2 text-purple-400">{new Date(order.deliver_by).toLocaleDateString("en-NZ", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}</span>
                    </div>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}