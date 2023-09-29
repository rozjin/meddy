'use client'

import Form from "@/meddy/components/Form"
import ImageDrop from "@/meddy/components/ImageDrop"
import { fetcher } from "@/meddy/hooks/fetcher"
import { Button, Input, Spinner } from "@nextui-org/react"
import { FormEvent, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { RiAddLine, RiCloseLine, RiPassportLine } from "react-icons/ri"

import useSWR from "swr"

export default () => {
  const { data: userData, isLoading: isUserLoading, error: userError } : { data: any, isLoading: boolean, error: any } = useSWR('/api/user', fetcher)
  const [ files, setFiles ] = useState<File[]>([])
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("op", "id")
    files.map((f, i) => formData.append(`id[${i}]`, f))

    const res = await fetch(e.currentTarget.action, {
      method: e.currentTarget.method,
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

  if (isUserLoading) return (
    <Spinner
      aria-label="Loading user information"

      color="secondary"
      className="m-auto"

      size="lg"
    />
  )

  return (
    <form className="flex flex-col gap-2 w-full" action="/api/user" method="POST" onSubmit={onSubmit}>
      <div className="flex flex-row gap-2 items-center">
        <RiPassportLine className="w-24 h-24" />
        <div className="flex flex-col gap-2">
          <h4 className="text-purple-800 font-semibold text-2xl">Your photo ID</h4>
          <p className="text-purple-400 text-sm">Please upload the front and back of your driver's license, or the photo page of your passport</p>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <h4 className="text-purple-800 font-semibold">Identity</h4>
          <div className="flex flex-row gap-2">
            <ImageDrop 
              previewURL={userData.user.proof_id[0] || null}

              page={0}
              files={files}
              setFiles={setFiles}
            />
            <ImageDrop 
              previewURL={userData.user.proof_id[1] || null}

              page={1}
              files={files}
              setFiles={setFiles}
            />
          </div>
        </div>
      </div>
      <Button className="text-purple-50 bg-purple-800" type="submit">
        <span>Save</span>
      </Button>
    </form>
  )
}