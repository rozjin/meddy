"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import toast from "react-hot-toast";

const Form = ({ children, className, action }: 
  { children: React.ReactNode; className?: string, action?: string; }
) => {
  const router = useRouter()
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch(action as string, {
      method: e.currentTarget.method,
      body: formData,
      redirect: "manual"
    });
    
    try {
      const json = await res.json()
      if (!res.ok) {
        if (json.message) toast.error(json.message)
      } else {
        if (json.message) toast.success(json.message)    
      }
    } catch (err) {
      console.log(`Form failed to parse JSON: ${err}`)
    }

    router.refresh()
  }

  return (
    <form 
      action={action}

      method="POST"
      onSubmit={onSubmit}

      className={className}
    >
      {children}
    </form>
  )
}

export default Form;