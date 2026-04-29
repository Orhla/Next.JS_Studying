"use client"

import { weatherCodes } from "@/lib/weatherCodes"

type Props = {
    description: string
}

export default function DisplayDescription({description}: Props) {

    return (
        <div>
            Погода: {description}, {weatherCodes[description]}
        </div>
    )
}