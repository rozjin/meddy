import { Button, Card, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { FormEvent, MutableRefObject, useRef, useState } from "react"
import { RiCameraLine, RiCamera2Line } from "react-icons/ri"
import PrescriptionDrop from "@/meddy/components/PrescriptionDrop"
import toast from "react-hot-toast"

export default ({ isOpen, onOpenChange } : { isOpen: boolean, onOpenChange: () => void }) => {
  const [ pages, setPages ] = useState(1)
  const [ files, setFiles ] = useState<File[]>([])

  const range = (size: number): ReadonlyArray<number> => {
    return Array(size).fill(0).map((_, i) => i);
  }

  const onCancel = () => { setPages(1); onOpenChange(); setFiles([]); }
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("op", "upload")
    files.map((f, i) => formData.append(`files[${i}]`, f))

    const res = await fetch(e.currentTarget.action, {
      method: "POST",
      body: formData,
      redirect: "manual"
    });
    
    try {
      if (res.ok) {
        const json = await res.json()
        toast.success(json.message)
      } else {
        const json = await res.json()
        toast.error(json.message)
      }
    } catch (err) {
      console.log(`Form failed to parse JSON: ${err}`)
    }
  }

  const onClose = () => {
    setFiles([])
    onOpenChange()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="flex flex-col items-start justify-between p-4 text-purple-800 bg-purple-50 ring-purple-800 ring-2">
      <ModalContent>
        <ModalHeader className="flex flex-row items-center justify-between mx-auto">
          <RiCamera2Line className="w-12 h-12 mt-1 mr-2" />
          <h3 className="text-xl">Take a picture of your prescription</h3>
        </ModalHeader>
        <form className="flex flex-col items-center justify-between mx-auto bg-white ring-1 ring-black rounded-lg pt-4" 
          action="/api/prescription" method="post" onSubmit={onSubmit}
        >
          <ModalBody className="grid min-h-full grid-cols-2 auto-rows-auto">
            {range(pages).map((page) => <PrescriptionDrop key={page} page={page} files={files} setFiles={setFiles} />)}
            <Card
              isPressable
              onPress={() => setPages(pages + 1)}

              className="flex flex-col items-center justify-center p-4 bg-purple-700 text-purple-50 w-42 h-42"
            >
              <RiCameraLine className="w-8 h-8 mb-7" />
              <span className="mt-6">Add Page</span>
            </Card>
          </ModalBody>
          <ModalFooter className="flex flex-row items-center justify-center -ml-4">
            <Button variant="flat" className="text-purple-800 bg-white ring-1 ring-purple-800" size="lg" type="submit">
              <span>Continue</span>
            </Button>
            <Button
              onPress={onCancel}
              className="ml-2 bg-purple-700 text-purple-50"
              size="lg"
            >
              <span>Cancel</span>
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}