import { Button, Input, Listbox, ListboxItem, ScrollShadow } from "@nextui-org/react"
import { ChangeEvent, useRef, useState, Key, useEffect } from "react"
import { useMap } from "usehooks-ts"

export default ({ isRequired, isClearable, isEditable = true, onChange, defaultValue, name, type, keyPlaceholder, valuePlaceholder, error }: {
  isRequired?: boolean, isClearable?: boolean, isEditable?: boolean, onChange?: (key: string, value: string) => void, defaultValue?: string, name?: string, type?: 'text' | 'search' | 'url' | 'tel' | 'email' | 'password'
  keyPlaceholder?: string, valuePlaceholder?: string, error?: string }) => {
  
  const [ fieldName, setName ] = useState(name || "");
  const [ fieldValue, setValue ] = useState(defaultValue || "")

  useEffect(() => {
    if (onChange) onChange(fieldName as string, fieldValue as string)
  }, [ fieldValue ])
  
  return (
    <div className="flex flex-row items-center justify-between w-full gap-2"> 
      <Input 
        isRequired={isRequired}
        isClearable={isClearable}
        isDisabled={!isEditable}

        type={type}
        placeholder={keyPlaceholder}

        isInvalid={!(!!fieldName && !!fieldValue)}

        onClear={() => setName("")}
        onChange={(e) => setName(e.target.value)}
        value={fieldName}

        classNames={{
          base: "w-1/2",

          input: [
            "text-purple-800"
          ],

          innerWrapper: "bg-transparent",
          inputWrapper: "bg-transparent border border-purple-800 border-2",
          errorMessage: "font-bold text-purple-900"
        }}

        errorMessage={error}
      />
      <Input 
        isRequired={true}
        isClearable={isClearable}
        isDisabled={!isEditable}

        isInvalid={!(!!fieldName && !!fieldValue)}

        name={`${name}[]`}
        type={type}
        placeholder={valuePlaceholder}

        onClear={() => setValue("")}
        onChange={(e) => setValue(e.target.value)}
        value={fieldValue}

        classNames={{
          base: "w-1/2",

          input: [
            "text-purple-800"
          ],

          innerWrapper: "bg-transparent",
          inputWrapper: "bg-transparent border border-purple-800 border-2",
          errorMessage: "font-bold text-purple-900"
        }}

        errorMessage={error}
      />
    </div>
  )
}