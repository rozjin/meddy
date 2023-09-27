'use client'

import PrescriptionUpload from "@/meddy/components/PrescriptionUpload";
import TransferRefill from "@/meddy/components/TransferRefill";
import { fetcher } from "@/meddy/hooks/fetcher";
import { Accordion, AccordionItem, Button, Chip, Divider, Image, Modal, ModalBody, ModalContent, toggle, useDisclosure } from "@nextui-org/react"
import { RiFileUploadLine, RiArrowLeftRightLine, RiSearch2Line, RiImage2Line } from 'react-icons/ri'

import { useEffect, useState } from "react";

import ImageZoom from "react-image-zooom";

import useSWR from "swr";

export default () => {
  const { isOpen: isUploadOpen, onOpenChange: onUploadChange, onOpen: onUploadOpen } = useDisclosure();
  const { isOpen: isTransferOpen, onOpenChange: onTransferChange, onOpen: onTransferOpen } = useDisclosure();
  const [ isPrescriptionsOpen, setPrescriptionsOpen ] = useState<boolean[]>([])
  const isPrescriptionOpen = (idx: number) => isPrescriptionsOpen[idx];
  const togglePrescriptionOpen = (idx: number) => () => setPrescriptionsOpen(prev => {
    const newPrescriptionsOpen = [...prev];
    newPrescriptionsOpen[idx] = !newPrescriptionsOpen[idx]

    return newPrescriptionsOpen
  })

  const [ prescriptionFilter, setPrescriptionFilter ] = useState(0);

  const { data, isLoading, error } = useSWR('/api/prescription', fetcher)

  useEffect(() => {
    if (data) setPrescriptionsOpen((data as any).prescriptions.map((_: any) => false))
  }, [data])

  return (
    <>
      <div className="flex flex-row items-center justify-between w-full -mt-2 bg-purple-50 p-2 rounded-xl">
        <div className="flex flex-row items-center">
          <span className="mr-4 text-base text-purple-800 font-semibold">Showing: </span>
          <Chip 
            className="text-purple-800 bg-purple-100 cursor-pointer" size="lg"

            onClick={() => setPrescriptionFilter(0)}
          >All</Chip>
          <Chip 
            className="ml-2 text-purple-800 bg-purple-100 cursor-pointer" size="lg"
            onClick={() => setPrescriptionFilter(2)}
          >Cancelled</Chip>
          <Chip 
            className="ml-2 text-purple-800 bg-purple-100 cursor-pointer" size="lg"
            onClick={() => setPrescriptionFilter(1)}
          >Filled</Chip>
        </div>
        <div className="flex flex-row items-center">
          <Button
            isIconOnly
            variant="flat"
            className="text-purple-800 bg-purple-100"

            onPress={onTransferOpen}
          >
            <RiArrowLeftRightLine className="w-6 h-6" />
            <TransferRefill isOpen={isTransferOpen} onOpenChange={onTransferChange} />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            className="ml-2 text-purple-800 bg-purple-100"

            onPress={onUploadOpen}
          >
            <RiFileUploadLine className="w-6 h-6" />
            <PrescriptionUpload isOpen={isUploadOpen} onOpenChange={onUploadChange} />
          </Button>
        </div>
      </div>
      <Divider orientation="horizontal" className="my-2" />
      <Accordion>
        {!isLoading && (data as any).prescriptions.filter((prescription: any) => ({
            0: true,
            1: prescription.progress == "FILLED",
            2: prescription.progress == "CANCELLED"
          }[prescriptionFilter])).map((prescription: any, idx: number) => (
          <AccordionItem
            title={`Created On: ${new Date(prescription.created).toLocaleString('en-NZ')}`}
            subtitle={`Prescription ID: ${prescription.friendly_id}`}

            classNames={{
              trigger: "bg-white p-2 rounded-lg bg-purple-50",
              title: "text-purple-700",
              subtitle: "text-purple-400",
            }}

            hideIndicator

            key={prescription.friendly_id}
          >
            <div className="flex flex-row justify-between items-center">
              <span className="text-purple-800 bg-purple-100 p-2 rounded-lg">
                {{
                  "REQUESTED": "Prescription Requested",
                  "RECEIVED": "Prescription Received",

                  "FILLED": "Prescription Filled",
                  "CANCELLED": "Prescription Cancelled"
                }[prescription.progress as string]}
              </span>
              <Button
                isIconOnly
                variant="flat"
                className="text-purple-800 bg-purple-100"

                onPress={togglePrescriptionOpen(idx)}
              >
                <RiSearch2Line className="w-6 h-6" />
              </Button>
              <Modal isOpen={isPrescriptionOpen(idx)} onClose={togglePrescriptionOpen(idx)} className="flex flex-col items-start justify-between p-4 text-purple-800 bg-purple-50 ring-purple-800 ring-2">
                <ModalContent>
                  <ModalBody>
                    {prescription.progress != "CANCELLED" ?
                      <Accordion>
                        {{ "UPLOAD": (
                            <AccordionItem
                              classNames={{
                                trigger: "bg-white p-2 rounded-lg bg-purple-50",
                                title: "text-purple-700",
                                subtitle: "text-purple-400",
                              }}

                              title="Prescription Uploaded"
                              subtitle="Your prescription has been received online"
                            >

                            </AccordionItem>
                          ),

                          "FAX": (
                            <AccordionItem
                              classNames={{
                                trigger: "bg-white p-2 rounded-lg bg-purple-50",
                                title: "text-purple-700",
                                subtitle: "text-purple-400",
                              }}

                              title="Transfer Initiated"
                              subtitle="A fax request was sent to your pharmacy to request your prescriptions"
                            ></AccordionItem>
                          ),

                          "MAIL": (
                            <AccordionItem
                              classNames={{
                                trigger: "bg-white p-2 rounded-lg bg-purple-50",
                                title: "text-purple-700",
                                subtitle: "text-purple-400",
                              }}

                              title="Paper received"
                              subtitle="Your prescription was received in the mail"
                            ></AccordionItem>
                          ),

                          "EPS": (
                            <AccordionItem
                              classNames={{
                                trigger: "bg-white p-2 rounded-lg bg-purple-50",
                                title: "text-purple-700",
                                subtitle: "text-purple-400",
                              }}

                              title="Transfer Initiated"
                              subtitle="A request was sent to receive your prescription electronically"
                            ></AccordionItem>
                          )
                        }[prescription.method as string]}
                        {{ "MAIL": (
                              <AccordionItem
                                classNames={{
                                  trigger: "bg-white p-2 rounded-lg bg-purple-50",
                                  title: "text-purple-700",
                                  subtitle: "text-purple-400",
                                }}

                                isDisabled={!(prescription.progress == "RECEIVED" || prescription.progress == "FILLED")}

                                title="Mail reviewed"
                                subtitle="Your prescriptions were reviewed by a pharmacist and can now be viewed in your profile"
                              ></AccordionItem>
                            ),

                            "UPLOAD": (
                              <AccordionItem
                                classNames={{
                                  trigger: "bg-white p-2 rounded-lg bg-purple-50",
                                  title: "text-purple-700",
                                  subtitle: "text-purple-400",
                                }}

                                isDisabled={!(prescription.progress == "RECEIVED" || prescription.progress == "FILLED")}

                                title="Copy received"
                                subtitle="Your prescription was reviewed by a pharmacist and can now be viewed in your profile"
                              ></AccordionItem>
                            ),

                            "FAX": (
                              <AccordionItem
                                classNames={{
                                  trigger: "bg-white p-2 rounded-lg bg-purple-50",
                                  title: "text-purple-700",
                                  subtitle: "text-purple-400",
                                }}

                                isDisabled={!(prescription.progress == "RECEIVED" || prescription.progress == "FILLED")}
                                
                                title="Fax received"
                                subtitle="Your prescriptions were received and can now be viewed in your profile"
                              ></AccordionItem>
                            ),

                            "EPS": (
                              <AccordionItem
                                classNames={{
                                  trigger: "bg-white p-2 rounded-lg bg-purple-50",
                                  title: "text-purple-700",
                                  subtitle: "text-purple-400",
                                }}

                                isDisabled={!(prescription.progress == "RECEIVED" || prescription.progress == "FILLED")}

                                title="ePS Received"
                                subtitle="Your prescriptions were received and can now be viewed in your profile"
                              ></AccordionItem>
                            )
                          }[prescription.method as string]}
                        <AccordionItem
                          classNames={{
                            trigger: "bg-white p-2 rounded-lg bg-purple-50",
                            title: "text-purple-700",
                            subtitle: "text-purple-400",
                          }}

                          isDisabled={!(prescription.progress == "FILLED")}

                          title="Prescription filled"
                          subtitle="Prescription filled. Please create a new order to receive your medication"
                        ></AccordionItem>
                      </Accordion>
                    :
                      <Accordion>
                        <AccordionItem
                          classNames={{
                            trigger: "bg-white p-2 rounded-lg bg-purple-50",
                            title: "text-purple-700",
                            subtitle: "text-purple-400",
                          }}

                          title="Prescription cancelled"
                          subtitle="Prescription cancelled. Please contact the pharmacist for more information"
                        ></AccordionItem>
                      </Accordion>
                    }
                  </ModalBody>
                </ModalContent>
              </Modal>
            </div>
            <div className="flex flex-row justify-start items-center gap-2 overflow-scroll mt-4">
              {prescription.pictures.map((picture: any) => (
                <ImageZoom 
                  height="128"
                  width="128"

                  alt="Prescription image"

                  src={picture}
                />
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}