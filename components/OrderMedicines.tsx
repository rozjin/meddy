import { Button, Card, Divider, Input, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress, Tab, Tabs } from "@nextui-org/react"
import { RiMedicineBottleLine } from "react-icons/ri"
import Form from '@/meddy/components/Form'
import { Key, useState } from "react"
import { fetcher } from "@/meddy/hooks/fetcher"
import useSWR from "swr"
import toast from "react-hot-toast"
import ReactDatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css";

export default ({ isOpen, onOpenChange } : { isOpen: boolean, onOpenChange: () => void }) => {
  const [ selectedTab, setSelectedTab ] = useState<"select" | "order">("select");
  const [ selectedMedicines, setSelectedMedicines ] = useState<string[]>([]);
  
  const today = new Date()
  const minDeliverBy = new Date(today.setDate(today.getDate() + 3))

  const [ deliverBy, setDeliverBy ] = useState<Date>(minDeliverBy);

  const [ orderProgress, setOrderProgress ] = useState(50)

  const onProgress = async () => {
    switch (selectedTab) {
      case "select": {
        if (selectedMedicines.length == 0) {
          toast.error("Please select medicines to continue your order")
          break;
        }

        setSelectedTab("order")
        setOrderProgress(100)

        break;
      }

      case "order": {
        const data = new FormData()

        data.append("deliverBy", deliverBy.toISOString())
        selectedMedicines.map((selected, i) => data.append(`ids[${i}]`, selected))

        const res = await fetch("/api/order", {
          method: "POST",
          body: data,
          redirect: "manual"
        });
    
        try {
          if (!res.ok) {
            const json = await res.json()
            if (json.message) toast.error(json.message)
          } else {
            const json = await res.json()
            if (json.message) toast.success(json.message)
          }
        } catch (err) {
          console.log(`Form failed to parse JSON: ${err}`)
        }

        onClose()
        break;
      }
    }
  }

  const onSwitchTab = (key: Key) => {
    if (selectedTab == "select" && key == "order") {
      if (selectedMedicines.length == 0) {
        return toast.error("Please select medicines to continue your order")
      }

      setSelectedTab("order")
      setOrderProgress(100)
    }
  }

  const onClose = () => {
    setSelectedTab("select")
    setSelectedMedicines([])
    setOrderProgress(50)

    onOpenChange()
  }

  const { data: medicineData, isLoading: isMedicineLoading, error: medicineError }: 
    { data: any, isLoading: boolean, error: any }= useSWR('/api/medicine', fetcher)
  const { data: userData, isLoading: isUserLoading, error: userError }:
    { data: any, isLoading: boolean, error: any } = useSWR('/api/user', fetcher)

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="flex flex-col items-start justify-between p-4 text-purple-800 bg-purple-50 ring-purple-800 ring-2">
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

              selectedKey={selectedTab}
              onSelectionChange={onSwitchTab}

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
                    onSelectionChange={(keys) => {
                      const selectedKeys = keys as Set<Key>
                      setSelectedMedicines([...selectedKeys] as string[])
                    }}
                  >
                    {medicineData.medicines.map((medicine: any) => (
                      <ListboxItem
                        key={medicine.friendly_id}
                        textValue={medicine.name}

                        isReadOnly={medicine.cur_renew - medicine.num_renew == 0}
                      >
                        <div className="flex flex-col items-start justify-center">
                          <span className="font-semibold">{medicine.name} {medicine.unit}</span>
                          <span className="text-purple-400">Repeats left: {medicine.num_renew - medicine.cur_renew} of {medicine.num_renew}</span>
                        </div>
                      </ListboxItem>
                    ))}
                  </Listbox>
                  <Divider orientation="horizontal" />
                  <div className="flex flex-row justify-between items-center mt-4">
                    <Button variant="flat" className="text-purple-800 bg-white ring-1 ring-purple-800" onPress={onClose}>
                      <span>Cancel</span>
                    </Button>
                    <Button className="text-purple-50 bg-purple-800" onPress={onProgress}>
                      <span>Continue</span>
                    </Button>
                  </div>
                </>
              )}
            </Tab>
            <Tab key="order" title="Order">
            <h4 className="text-lg">Finalize your order</h4>
              {!isMedicineLoading && (
                <>
                  <Listbox
                    aria-label="Finalize Order"
                    selectionMode="multiple"
                    selectedKeys={selectedMedicines}
                  >
                    {medicineData.medicines.map((medicine: any) => (
                      <ListboxItem
                        key={medicine.friendly_id}
                        textValue={medicine.name}

                        isReadOnly={medicine.cur_renew - medicine.num_renew == 0}                        
                      >
                        <div className="flex flex-col items-start justify-center">
                          <span className="font-semibold">{medicine.name} {medicine.unit}</span>
                          <span className="text-purple-400">Repeats left: {medicine.num_renew - medicine.cur_renew} of {medicine.num_renew}</span>
                        </div>
                      </ListboxItem>
                    ))}
                  </Listbox>
                  <Divider orientation="horizontal" />
                  { !isUserLoading && (
                  <div className="flex flex-col justify-between items-start my-2 text-sm">
                    <span className="text-purple-800 flex flex-row justify-start items-center">
                      <span className="mr-2">Ship to:</span>
                      <span className="text-purple-400">{userData.user.address}</span>
                    </span>
                    <span className="text-purple-800 flex flex-row justify-start items-center">
                      <span className="mr-2">Deliver by:</span>
                      <ReactDatePicker 
                        allowSameDay={false}
                        minDate={minDeliverBy}

                        selected={deliverBy} 
                        onChange={(date) => setDeliverBy(date!)} 
                      />
                    </span>
                  </div>
                  )}
                  <Divider orientation="horizontal" />
                  <div className="flex flex-row justify-between items-center mt-2">
                    <Button variant="flat" className="text-purple-800 bg-white ring-1 ring-purple-800" 
                      onPress={() => {
                        setSelectedTab("select")
                        setOrderProgress(50)
                      }}>
                      <span>Back</span>
                    </Button>
                    <Button className="text-purple-50 bg-purple-800" onPress={onProgress}>
                      <span>Order</span>
                    </Button>
                  </div>
                </>
              )}
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