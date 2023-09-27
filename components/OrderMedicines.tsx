import { Button, Card, Input, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress, Tab, Tabs } from "@nextui-org/react"
import { RiMedicineBottleLine } from "react-icons/ri"
import Form from '@/meddy/components/Form'
import { useState } from "react"
import { fetcher } from "@/meddy/hooks/fetcher"
import useSWR from "swr"

export default ({ isOpen, onOpenChange } : { isOpen: boolean, onOpenChange: () => void }) => {
  const [ selectedMedicines, setSelectedMedicines ] = useState<string[]>([]);
  const [ orderProgress, setOrderProgress ] = useState(50)

  const { data: medicineData, isLoading: isMedicineLoading, error: medicineError } = useSWR('/api/medicine', fetcher)

  return (
    <Modal isOpen={isOpen} onClose={onOpenChange} className="flex flex-col items-start justify-between p-4 text-purple-800 bg-purple-50 ring-purple-800 ring-2">
      <ModalContent>
        <ModalHeader className="flex flex-col items-center justify-between mx-auto">
          <div className="flex flex-row items-center justify-between">
            <RiMedicineBottleLine className="w-12 h-12 mt-1 mr-2" />
            <h3 className="text-xl">Order your medication</h3>
          </div>
        </ModalHeader>
        <Form className="flex flex-col items-center justify-between mx-auto">
          <Tabs
              aria-label="Navigation"
              className="flex flex-row items-center justify-center w-full m-4"

              classNames={{
                tabList: "bg-transparent",
                tab: "bg-white shadow-md",
                cursor: "shadow-lg",
                
                panel: "bg-white ring-1 ring-black p-4 rounded-lg w-96 flex flex-col"
              }}
          >
            <Tab key="select" title="Choose">
              <h4 className="text-lg">Choose medicines to order</h4>
              {!isMedicineLoading && (
                <>
                  <Listbox
                    aria-label="Choose medicines"
                    selectionMode="multiple"
                    selectedKeys={selectedMedicines}
                    onSelectionChange={setSelectedMedicines}
                  >
                    {medicineData.medicines.map(medicine => (
                      <ListboxItem
                        key={medicine.friendly_id}
                        textValue={medicine.name}
                      >
                        <div className="flex flex-col items-start justify-center">
                          <span className="font-semibold">{medicine.name} {medicine.unit}</span>
                          <span className="text-purple-400">Quantity left: {medicine.quantity - medicine.filled} unit{"(s)"}</span>
                        </div>
                      </ListboxItem>
                    ))}
                  </Listbox>
                  <div className="flex flex-row justify-between items-center mt-4">
                    <Button variant="flat" className="text-purple-800 bg-white ring-1 ring-purple-800" onPress={onOpenChange}>
                      <span>Cancel</span>
                    </Button>
                    <Button className="text-purple-50 bg-purple-800">
                      <span>Continue</span>
                    </Button>
                  </div>
                </>
              )}
            </Tab>
            <Tab key="order" title="Order">

            </Tab>
          </Tabs>
          <Progress classNames={{
              base: "mt-2",
              indicator: "bg-purple-800"
            }} 
            aria-label="Order Progress" 
            value={orderProgress} 
          />
        </Form>
     </ModalContent>
    </Modal>
  )
}