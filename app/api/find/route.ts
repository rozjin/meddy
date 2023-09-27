import { NextResponse, type NextRequest } from "next/server";
import { zfd } from "zod-form-data";

import pharmac from "@/meddy/app/api/find/pharmac.json"

type medicine = {
    id: string,
    chem_id: string,

    name: string,
    
    formulations: {
        id: string,

        form_id: string,
        pack_id: string,

        name: string,
        brand: string
        unit: string,
        rank: number

        quantity: number
    }[]
};

const medicines: medicine[] = pharmac as medicine[]
const names: { id: string, name: string }[] = medicines.flatMap(med => {
    return med.formulations.map(form => ({ id: form.id, chem: med.id, name: `${med.name} - ${form.name}, ${form.unit} ${form.quantity}` }))
})

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
    
    const drug = medicines.find(med => med.id == id);
    return NextResponse.json({
        data: drug
    })
}