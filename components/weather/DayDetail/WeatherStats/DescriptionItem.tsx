"use client"

import { weatherCodes, weatherCodesDescription } from "@/lib/weatherCodes"

type Props = {
    // description: string,
    description: weatherCodesDescription,
}

export default function DisplayDescription({description}: Props) {

    return (
        <div>
            Погода: {description}, {weatherCodes[description]}
        </div>
    )
}