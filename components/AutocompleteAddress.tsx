import { Button, Input, Listbox, ListboxItem, ScrollShadow } from "@nextui-org/react"
import { ChangeEvent, useRef, useState, Key } from "react"

import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

export default ({ isRequired, isClearable, isDisabled, defaultValue, name, type, placeholder, error }: {
  isRequired?: boolean, isClearable?: boolean, isDisabled?: boolean, defaultValue?: string, name?: string, type?: 'text' | 'search' | 'url' | 'tel' | 'email' | 'password'
  placeholder?: string, error?: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { placesService, placePredictions, getPlacePredictions } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_KEY
  });

  const [ open, setOpen ] = useState(false);
  const [ value, setValue ] = useState(defaultValue);

  const onPress = (key: Key) => () => {
    placesService?.getDetails(
      { placeId: key },
    (place: any) => setValue(place.formatted_address))
    setOpen(false)
  }

  const onClear = () => {
    setValue("")
    setOpen(false)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    getPlacePredictions({ input: e.target.value, componentRestrictions: {
      country: "NZ"
    }});

    if (!e.target.value || placePredictions.length == 0) setOpen(false)
    else setOpen(true)
  }
  
  return (
    <div className="flex flex-col items-center justify-start"> 
      <Input 
        isRequired={isRequired}
        isClearable={isClearable}
        isDisabled={isDisabled}

        name={name}
        type={type}
        placeholder={placeholder}

        onClear={onClear}
        onChange={onChange}
        value={value}

        ref={inputRef}

        classNames={{
          input: [
            "text-purple-800"
          ],

          innerWrapper: "bg-transparent",
          inputWrapper: "bg-transparent border border-purple-800 border-2",
          errorMessage: "font-bold text-purple-900"
        }}

        errorMessage={error}
      />
      {open && (
        <div
          aria-label="Addresses List"
          className="flex flex-col items-center mt-2 bg-white rounded-lg border"
          style={{
            width: `${inputRef.current?.offsetWidth}px`
          }}
        >
          <ScrollShadow className="w-full">
            {placePredictions.map(item => (
              <div
                key={item.place_id}
                aria-label={item.description}

                className="flex flex-row items-center w-full justify-start text-purple-700 m-1 p-2 text-md cursor-pointer"

                onClick={onPress(item.place_id)}
              >
                <span>{item.description}</span>
              </div>
            ))}
          </ScrollShadow>
        </div>
      )}
    </div>
  )
}