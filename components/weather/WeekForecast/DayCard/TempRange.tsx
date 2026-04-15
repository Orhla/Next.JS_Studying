"use client"

type Props = {
    tempMin: number,
    tempMax: number
}

export default function TempRange({tempMin, tempMax}: Props) {
    return (<div>
                Диапазон температуры: {tempMin} - {tempMax}
            </div>
           );
}