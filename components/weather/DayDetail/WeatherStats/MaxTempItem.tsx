"use client"

type Props = {
    tempMax: number
}

export default function DisplayMaxTemp({tempMax}: Props) {
    return (<div>
                Максимальная температура: {tempMax}°C
            </div>
           );
}