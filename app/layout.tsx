import Providers from "@/meddy/app/providers"
import "@/meddy/app/globals.css"
import Toaster from "@/meddy/components/Toaster"

export const metadata = {
  title: 'Meddy',
  description: 'NZ\'s digital pharmacy',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body> 
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  )
}
