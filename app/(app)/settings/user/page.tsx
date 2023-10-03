'use client'

import AutocompleteAddress from "@/meddy/components/AutocompleteAddress"
import Form from "@/meddy/components/Form"
import { fetcher } from "@/meddy/hooks/fetcher"
import { Button, Input, Spinner } from "@nextui-org/react"
import useSWR from "swr"

export default () => {
  const { data: userData, isLoading: isUserLoading, error: userError } : { data: any, isLoading: boolean, error: any } = useSWR('/api/user', fetcher)
  if (isUserLoading) return (
    <Spinner
      aria-label="Loading user information"

      color="secondary"
      className="m-auto"

      size="lg"
    />
  )

  return (
    <Form className="flex flex-col gap-2 w-full" action="/api/user">
      <input type="hidden" name="op" value="basic" />
      <div className="flex flex-row justify-between gap-2">
        <div className="flex flex-col w-1/2">
          <h4 className="text-purple-800 font-semibold">Name</h4>
          <Input
            isRequired
            isClearable

            defaultValue={userData.user.name}
            isDisabled={!userData.user.is_modifiable}

            name="name"
            type="text"
            placeholder="Joe Froggs"

            classNames={{
              input: [
                "text-purple-800"
              ],

              innerWrapper: "bg-transparent",
              inputWrapper: "bg-transparent border border-purple-800 border-2",
              errorMessage: "font-bold text-purple-900"
            }}

            errorMessage={"Please enter your name"}
          />
        </div>
        <div className="flex flex-col w-1/2">
          <h4 className="text-purple-800 font-semibold">Date of Birth</h4>
          <Input
            isRequired
            isClearable

            defaultValue={new Date(userData.user.dob).toLocaleDateString("en-NZ", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",

              timeZone: "Pacific/Auckland",
            })}
            isDisabled={!userData.user.is_modifiable}

            name="dob"
            type="text"
            placeholder="12/12/1993"

            classNames={{
              input: [
                "text-purple-800"
              ],

              innerWrapper: "bg-transparent",
              inputWrapper: "bg-transparent border border-purple-800 border-2",
              errorMessage: "font-bold text-purple-900"
            }}

            errorMessage={"Please enter your date of birth"}
          />
        </div>
      </div>
      <div className="flex flex-row justify-between gap-2">
        <div className="flex flex-col w-1/2">
          <h4 className="text-purple-800 font-semibold">Phone Number</h4>
          <Input
            isClearable

            defaultValue={userData.user.phone_number}
            isDisabled={!userData.user.is_modifiable}

            name="phone_number"
            type="tel"

            pattern="[0-9]{10}"
            placeholder="021 345 5670"

            classNames={{
              input: [
                "text-purple-800"
              ],

              innerWrapper: "bg-transparent",
              inputWrapper: "bg-transparent border border-purple-800 border-2",
              errorMessage: "font-bold text-purple-900"
            }}

            errorMessage={"Please enter your phone number"}
          />
        </div>
        <div className="flex flex-col w-1/2">
          <h4 className="text-purple-800 font-semibold">Gender</h4>
          <Input
            isClearable

            defaultValue={userData.user.gender}
            isDisabled={!userData.user.is_modifiable}

            name="gender"
            type="text"

            classNames={{
              input: [
                "text-purple-800"
              ],

              innerWrapper: "bg-transparent",
              inputWrapper: "bg-transparent border border-purple-800 border-2",
              errorMessage: "font-bold text-purple-900"
            }}
          />
        </div>      
      </div>
      <h4 className="text-purple-800 font-semibold">NHI</h4>
      <Input
        isRequired
        isClearable

        defaultValue={userData.user.patient.nhi}
        isDisabled={!userData.user.is_modifiable}

        name="nhi"
        type="text"

        classNames={{
          input: [
            "text-purple-800"
          ],

          innerWrapper: "bg-transparent",
          inputWrapper: "bg-transparent border border-purple-800 border-2",
          errorMessage: "font-bold text-purple-900"
        }}

        errorMessage={"Please enter your NHI number"}
      />
      <h4 className="text-purple-800 font-semibold">Address</h4>
      <AutocompleteAddress
        isRequired
        isClearable

        defaultValue={userData.user.address}
        isDisabled={!userData.user.is_modifiable}

        name="address"
        type="text"
        placeholder="1 Museum Street, Wellington"

        error={"Please enter your address"}
      />
      <Button isDisabled={!userData.user.is_modifiable} className="text-purple-50 bg-purple-800" type="submit">
        <span>Save</span>
      </Button>
    </Form>
  )
}