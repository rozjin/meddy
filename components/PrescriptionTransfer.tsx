import { Button, Card, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { RiArrowLeftRightLine, RiCamera2Line } from "react-icons/ri"
import Form from '@/meddy/components/Form'
import Autocomplete from "@/meddy/components/AutocompletePharmacy"
import { MutableRefObject, useRef, useState } from "react"

type pharmacy = {
  id: string,
  name: string,

  address: string
}

export default ({ isOpen, onOpenChange } : { isOpen: boolean, onOpenChange: () => void }) => {
  const [ open, setOpen ] = useState(false)
  const [ data, setData ] = useState<pharmacy | null>(null)

  const setPharmacyId = async (id: string) => {
    const form = new FormData()
      form.append("id", id)

    console.log(form)

    const res = await fetch('/api/pharmacy', {
      method: "POST",
      body: form,
      redirect: "manual"
    });

    const json = await res.json()

    setOpen(true);
    setData(json.data)
  }

  return (
    <Modal isOpen={isOpen} onClose={onOpenChange} className="flex flex-col items-start justify-between p-4 text-purple-800 bg-purple-50 ring-purple-800 ring-2">
      <ModalContent>
        <ModalHeader className="flex flex-col items-center justify-between mx-auto">
          <div className="flex flex-row items-center justify-between">
            <RiArrowLeftRightLine className="w-12 h-12 mt-1 mr-2" />
            <h3 className="text-xl">Transfer your refills</h3>
          </div>
          <span>Search and select your current pharmacy</span>
        </ModalHeader>
        <Form className="flex flex-col items-center justify-between mx-auto" action="/api/prescription">
          <input type="hidden" name="op" value="transfer" />
          <ModalBody className="flex flex-col items-center justify-center">
            <Autocomplete
              isRequired
              isClearable

              type="text"
              placeholder="Unichem"

              setPharmacyId={setPharmacyId}
            />
            <p className="text-sm text-purple-400 cursor-pointer" onClick={() => setOpen(true)}>Can't find your pharmacy? Click here to input it's details</p>
            {open && (
              <>
                <Input
                  isRequired
                  isClearable

                  defaultValue={data?.name}
                  name="name"
                  type="text"
                  placeholder="Unichem Pharmacy"

                  classNames={{
                    input: [
                      "text-purple-800"
                    ],

                    innerWrapper: "bg-transparent",
                    inputWrapper: "bg-transparent border border-purple-800 border-2",
                    errorMessage: "font-bold text-purple-900"
                  }}

                  errorMessage={"Please enter your pharmacy's name"}
                />
                <Input
                  isRequired
                  isClearable

                  defaultValue={data?.address}
                  name="address"
                  type="text"
                  placeholder="1 Riccarton Street"

                  classNames={{
                    input: [
                      "text-purple-800"
                    ],

                    innerWrapper: "bg-transparent",
                    inputWrapper: "bg-transparent border border-purple-800 border-2",
                    errorMessage: "font-bold text-purple-900"
                  }}

                  errorMessage={"Please enter your pharmacy's address"}
                />
              </>
            )}
          </ModalBody>
          <ModalFooter className="flex flex-row items-center justify-center">
            <Button variant="flat" className="bg-purple-800 text-purple-50" size="lg" type="submit">
              <span>Transfer</span>
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  )
}