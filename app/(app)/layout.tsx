'use client'

import React, { Key } from "react"
import { Divider, Link, Navbar, Tab, Tabs } from "@nextui-org/react";
import { usePathname, useRouter } from 'next/navigation';

export default ({ children } : { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const path = pathname == '/' ? '/' as Key : pathname.substring(1) as Key;
  return (
    <>
      <Tabs 
        aria-label="Navigation" 
        className="flex flex-row items-center justify-center w-full m-4" 

        selectedKey={path}
        onSelectionChange={(key) => router.push(`/${key}`)}
      >
        <Tab key="/" title="Home" />
        <Tab key="medicines" title="Medicines" />
        <Tab key="prescriptions" title="Prescriptions" />
        <Tab key="orders" title="Orders" />
        <Tab key="settings" title="Settings" />
      </Tabs>
      <Divider orientation="horizontal" />
      <main className="flex flex-col items-start w-full h-screen max-w-4xl p-4 mx-auto">
        {children}
      </main>
    </>
  )
}