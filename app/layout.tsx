'use client'

import Providers from "@/meddy/app/providers"
import "@/meddy/app/globals.css"
import Toaster from "@/meddy/components/Toaster"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <title>Meddy</title>
      </head>
      <body> 
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  )
}
