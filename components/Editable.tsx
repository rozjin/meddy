import { Button, Input } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { RiPencilLine } from "react-icons/ri";

export default ({ isRequired, isClearable, name, type, placeholder, error, validate }: {
  isRequired?: boolean, isClearable?: boolean, name?: string, type?: 'text' | 'search' | 'url' | 'tel' | 'email' | 'password',
  placeholder?: string, error?: string, validate: () => boolean
}) => {
  const [ isInvalid, setInvalid ] = useState(false);
  const [ isEditable, setEditable ] = useState(true);
  const onEdit = () => setEditable(!isEditable);

  useEffect(() => {
    setInvalid(validate())
  }, [isInvalid])

  return (
    <div className="flex flex-row items-center"> 
      <Input 
        isRequired={isRequired}
        isClearable={isClearable}
        isDisabled={!isEditable}

        name={name}
        type={type}
        placeholder={placeholder}
        isInvalid={isInvalid}

        classNames={{
          input: [
            "bg-purple-50 text-purple-800"
          ],

          innerWrapper: "bg-transparent",
          inputWrapper: "bg-transparent"
        }}

        errorMessage={error}
      />
      <Button
        isIconOnly 
        variant="flat" 
        className="text-purple-800 bg-purple-50"
        
        onPress={onEdit}
      >
        <RiPencilLine className="w-4 h-4" />
      </Button>
    </div>
  )
}