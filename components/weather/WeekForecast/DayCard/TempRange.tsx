"use client"

type Props = {
    tempMin: number,
    tempMax: number
}

export default function DisplayTempRange({tempMin, tempMax}: Props) {
    return (<div>
                Диапазон температур: {tempMin}°C - {tempMax}°C
            </div>
           );
}