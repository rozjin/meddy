import { Card, Modal, ModalContent, useDisclosure } from "@nextui-org/react"
import { Dispatch, SetStateAction, useState } from "react"
import { RiCameraLine, RiCloseLine } from "react-icons/ri"
import { useDropzone } from 'react-dropzone'

export default ({ page, files, setFiles } : { page: number, files: File[], setFiles: Dispatch<SetStateAction<File[]>> }) => {
  const [ preview, setPreview ] = useState<string | null>(null);
  const [ drag, setDrag ] = useState(false)
  const [ filled, setFilled ] = useState(false)
  
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg', '.webp'],
    },
    multiple: false,
    maxSize: 16000000,

    onDropAccepted: (inFiles) => {
      const file = inFiles[0];
      const inter = files;
      inter[page] = file

      setFiles(inter)
      setPreview(URL.createObjectURL(file))
      setFilled(true)
    },

    onDragEnter: () => setDrag(true),
    onDragLeave: () => setDrag(false)
  })

  const empty = () => {
    const inter = files
    setFiles(inter.splice(page, 1))
    setFilled(false)
  }

  return (
    <div
      { ...getRootProps() }
    >
      <Card
        isPressable
        onPress={() => filled ? empty() : open()}

        key={page}
        className="flex flex-col items-center justify-center p-4 text-purple-700 w-40 h-40 bg-white"
      >
        { filled ?
          <>
            <img 
              width={160}
              height={160}

              className="m-1"

              src={preview as string}
              onLoad={() => URL.revokeObjectURL(preview as string)}
            ></img>
          </>
          :
          drag ?
            <>
            <RiCameraLine className="w-8 h-8" />
            <span className="mt-6">Drop the file to upload</span>
            <span className="mt-2">Page {page}</span>
            </>
            :           
            <>
              <RiCameraLine className="w-8 h-8" />
              <span className="mt-6">Upload a picture</span>
              <span className="mt-2">Page {page}</span>
            </>        
        }
        <input { ...getInputProps() } />
      </Card>
    </div>
  )
}