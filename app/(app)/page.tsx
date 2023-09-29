'use client'

import { Card, Link, Spinner, User } from '@nextui-org/react'

import { RiMedicineBottleLine, RiFileUploadLine, RiArrowLeftRightLine, RiSearchLine, RiFileCopyLine } from 'react-icons/ri'
import { FaFilePrescription, FaPhoneAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import useSWR from 'swr'
import { fetcher } from '@/meddy/hooks/fetcher'

export default () => {
  const { data: userData, isLoading: isUserLoading, error: userError } : { data: any, isLoading: boolean, error: any } = useSWR('/api/user', fetcher)
  const router = useRouter();
  if (isUserLoading) return (
    <Spinner
      aria-label="Loading user information"

      color="secondary"
      className="m-auto"

      size="lg"
    />
  )

  return (
    <>
      <h1 className="text-3xl font-semibold ">Home</h1>
      <div className="flex flex-row justify-between w-full mt-2 text-purple-800 font-medium">
        <span>You're up to date!</span>
        <User name={userData.user.name} 
          description="Patient"
          className="self-end"
        />
      </div>
      <h1 className="mt-4 text-3xl font-semibold">What would you like to do?</h1>
      <p className="text-default-400">Your pharmacy needs, our services</p>
      <div className="grid w-full grid-cols-2 grid-rows-2 gap-4 mt-4">
        <Card 
          isPressable
          onPress={() => router.push('orders')}

          className="action"
        >
          <RiMedicineBottleLine className="w-16 h-16 p-2 bg-white rounded-lg" />
          <span className="mt-2 text-lg font-bold">Order</span>
          <span className="font-medium">Medications</span>
        </Card>
        <Card 
          isPressable
          onPress={() => router.push('prescriptions')}

          className="action"
        >
          <RiFileUploadLine className="w-16 h-16 p-2 bg-white rounded-lg" />
          <span className="mt-2 text-lg font-bold">Upload</span>
          <span className="font-medium">Prescriptions</span>
        </Card>
        <Card
          isPressable
          onPress={() => router.push('prescriptions')}

          className="action"
        >
          <RiArrowLeftRightLine className="w-16 h-16 p-2 bg-white rounded-lg" />
          <span className="mt-2 text-lg font-bold">Transfer</span>
          <span className="font-medium">your refills</span>
        </Card>
        <Card
          isPressable
          onPress={() => router.push('medicines')}

          className="action"
        >
          <RiSearchLine className="w-16 h-16 p-2 bg-white rounded-lg" />
          <span className="mt-2 text-lg font-semibold">Search</span>
          <span className="font-medium">Medications</span>
        </Card>
      </div>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-4 mt-4">
      <Card 
          isPressable
          onPress={() => toast("Fax number copied to your clipboard")}

          className="flex flex-col items-start justify-between p-4 mt-4 text-purple-800"
        >
          <span className="text-lg font-bold">Doctor's appointment coming up?</span>
          <div className="flex flex-row justify-between w-full">
            <span className="mr-4 font-semibold text-default-400 text-start">Ask your clinic to fax or send the prescriptions to Meddy!</span>
            <FaFilePrescription className="w-16 h-16" />
          </div>
          <div className="flex flex-row items-center justify-start">
            <h4 className="text-xl font-semibold">04-123-3456</h4>
            <RiFileCopyLine className="w-5 h-5 mt-1 ml-2" />
          </div>
        </Card>
        <Card 
          isPressable
          onPress={() => toast.success("Phone number copied to your clipboard")}

          className="flex flex-col items-end justify-between p-4 mt-4 text-purple-800"
        >
          <span className="text-lg font-bold">Questions? Call or text us!</span>
          <div className="flex flex-row justify-between w-full">
            <FaPhoneAlt className="w-12 h-12" />
            <span className="font-semibold text-default-400 text-start">Our team is available during these hours:</span>
          </div>
          <div className="flex flex-col items-start justify-centre">
            <h6 className="font-semibold text-md">Mon - Fri 10:00 AM - 7:00 PM, NZST</h6>
            <h6 className="font-semibold text-md">Sat: 11:00AM - 7:00 PM, NZST</h6>
          </div>
        </Card>
      </div>
    </>
  )
}