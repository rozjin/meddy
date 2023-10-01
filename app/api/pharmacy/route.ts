import { NextResponse, type NextRequest } from "next/server";
import { zfd } from "zod-form-data";

import pharmacy from "@/meddy/app/api/pharmacy/pharmacies.json"

type pharmacy = {
    id: string,

    name: string,
    address: string
};

const pharmacies: pharmacy[] = pharmacy as pharmacy[]
const names = pharmacies.map(pharmacy => ({ id: pharmacy.id, name: pharmacy.name }))

export const GET = async (req: NextRequest) => {
    return NextResponse.json({
        data: names
    })
};

const schema = zfd.formData({
    id: zfd.text()
})

export const POST = async(req: NextRequest) => {
    const { id } = schema.parse(await req.formData())
    
    const pharmacy = pharmacies.find(pharmacy => pharmacy.id == id);
    return NextResponse.json({
        data: pharmacy
    })
}