import { Button, Card, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { RiArrowLeftRightLine, RiCamera2Line } from "react-icons/ri"
import Form from '@/meddy/components/Form'

export default ({ isOpen, onOpenChange } : { isOpen: boolean, onOpenChange: () => void }) => {
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
        <Form className="flex flex-col items-center justify-between mx-auto">
          <ModalBody className="flex flex-row items-center justify-center">
            <Input 
              isRequired
              isClearable
              type="text"
              placeholder="Unichem"

              classNames={{
                input: [
                  "bg-purple-100 text-purple-800"
                ],

                innerWrapper: "bg-transparent",
                inputWrapper: "bg-transparent border border-purple-800 border-2",
                errorMessage: "font-bold text-purple-900"
              }}
            />
          </ModalBody>
          <ModalFooter className="flex flex-row items-center justify-center">
            <Button variant="flat" className="bg-purple-800 text-purple-50" size="lg">
              <span>Transfer</span>
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  )
}