import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider, useSession } from "next-auth/react"

import React from 'react'

const Providers = ({ children } : { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </SessionProvider>
  )
}

export default Providers