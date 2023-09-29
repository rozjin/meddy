import { Button, Divider, Input, Listbox, ListboxItem, ScrollShadow } from "@nextui-org/react"
import { ChangeEvent, useEffect, useState, Key } from "react"

import Fuse from 'fuse.js'

export default ({ isRequired, isClearable, isEditable = true, name, type, placeholder, error, validate, setMedId }: {
  isRequired?: boolean, isClearable?: boolean, isEditable?: boolean, name?: string, type?: 'text' | 'search' | 'url' | 'tel' | 'email' | 'password'
  placeholder?: string, error?: string, validate?: (value: string) => boolean, setMedId: (value: string) => void
}) => {
  const [ list, setList ] = useState<{ id: string, name: string }[]>([])
  const matcher = new Fuse(list, {
    includeMatches: true,
    includeScore: true,
    shouldSort: true,
    threshold: 0.1,

    keys: ["name"]
  })

  const medicines = async () => {
    const res = await fetch('/api/find')
    const json = await res.json()
    const data: { id: string, name: string }[] = json.data;

    return data;
  }
  
  useEffect(() => {
    const fetch = async () => {
      const list = await medicines()
      setList(list);
    }

    fetch()
  }, [])

  const [ matches, setMatches ] = useState<Fuse.FuseResult<{ id: string, chem: string, name: string }>[]>([])

  const [ open, setOpen ] = useState(false);
  const [ isInvalid, setInvalid ] = useState(false);
  const [ value, setValue ] = useState("");

  const onPress = (key: Key, id: string) => () => {
    setValue(key as string)
    setMedId(id)
    setOpen(false)
  }

  const onClear = () => {
    setValue("")
    setOpen(false)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (validate) setInvalid(validate(value));

    setMatches(matcher.search(e.target.value))
    if (matches.length > 0) setOpen(true) 
    if (!e.target.value || matches.length == 0) setOpen(false)
  }
  
  return (
    <div className="flex flex-col items-center justify-start"> 
      <Input 
        isRequired={isRequired}
        isClearable={isClearable}
        isDisabled={!isEditable}

        name={name}
        type={type}
        placeholder={placeholder}
        isInvalid={isInvalid}

        onClear={onClear}
        onChange={onChange}
        value={value}

        classNames={{
          input: [
            "text-purple-800"
          ],

          innerWrapper: "bg-transparent",
          inputWrapper: "border border-purple-800 border-2 bg-white",
          errorMessage: "font-bold text-purple-900"
        }}

        errorMessage={error}
      />
      {open && (
        <div
          aria-label="Medicines List"
          className="flex flex-col items-center mt-2 bg-white max-w-[224px] rounded-lg max-h-52 border"
        >
          <ScrollShadow>
            {matches.map(item => (
              <>
                <div
                  key={item.item.id}
                  aria-label={item.item.name}

                  className="flex flex-row items-center justify-start text-purple-700 m-1 p-2 text-md cursor-pointer"

                  onClick={onPress(item.item.name, item.item.chem)}
                >
                  <span>{item.item.name}</span>
                </div>
                <Divider orientation="horizontal" />
              </>
            ))}
          </ScrollShadow>
        </div>
      )}
    </div>
  )
}