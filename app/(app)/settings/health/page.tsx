'use client'

import AutocompleteAddress from "@/meddy/components/AutocompleteAddress"
import Form from "@/meddy/components/Form"
import KeyValue from "@/meddy/components/KeyValue"
import { fetcher } from "@/meddy/hooks/fetcher"
import { Button, Input, Spinner } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { RiAddLine, RiCloseLine } from "react-icons/ri"

import useSWR from "swr"
import { useMap } from "usehooks-ts"

export default () => {
  const { data: userData, isLoading: isUserLoading, error: userError } : { data: any, isLoading: boolean, error: any } = useSWR('/api/user', fetcher)

  const [ otc, setOTC ] = useState("");
  const [ map, actions ] = useMap()

  const router = useRouter()
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("op", "health")
    formData.append("otc", JSON.stringify(otc.split(",")))
    formData.append("allergies", JSON.stringify(Array.from(map, ([k, v]) => ({
      trigger: k,
      condition: v
    }))))

    const res = await fetch(e.currentTarget.action, {
      method: e.currentTarget.method,
      body: formData,
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

    router.refresh()
  }

  useEffect(() => {
    if (userData) {
      setOTC(userData.user.patient.otc.join(","))
      userData.user.patient.allergies.map((item: any) => actions.set(item.trigger, item.condition))
    }
  }, [userData])

  if (isUserLoading) return (
    <Spinner
      aria-label="Loading user information"

      color="secondary"
      className="m-auto"

      size="lg"
    />
  )

  return (
    <form className="flex flex-col gap-2 w-full" method="POST" onSubmit={onSubmit} action="/api/user">
      <div>
        <h4 className="text-purple-800 font-semibold">OTC Medicines</h4>
        <Input
          isClearable

          onChange={(e) => setOTC(e.currentTarget.value)}
          onClear={() => setOTC("")}

          name="otc"
          type="text"

          value={otc}

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
      <div className="flex flex-col gap-2">
        <h4 className="text-purple-800 font-semibold">Allergies</h4>
        {Array.from(map, ([k, v]) => (
          <div className="flex flex-row"
            key={k as string}          
          >
            <KeyValue
              isRequired
              isClearable

              defaultValue={v as string}
              name={k as string}
              type="text"

              keyPlaceholder={"The allergy you have"}
              valuePlaceholder={"What happens when you have an allergic reaction"}

              onChange={(n, v) => { actions.remove(k), actions.set(n ,v)}}

              error={"Please enter your allergy information"}
            />
            <Button 
              isIconOnly 
              variant="flat" 
              className="text-purple-800 bg-purple-100 ml-2"

              onPress={() => actions.remove(k as string)}
            >
              <RiCloseLine className="w-6 h-6" />
            </Button>        
          </div>
        ))}
        <Button 
          isIconOnly 
          variant="flat" 
          className="text-purple-800 bg-purple-100 w-full"

          onPress={() => actions.set(`New Allergy ${map.size}`, "")}
        >
          <RiAddLine className="w-6 h-6" />
        </Button>
      </div>
      <Button className="text-purple-50 bg-purple-800" type="submit">
        <span>Save</span>
      </Button>
    </form>
  )
}