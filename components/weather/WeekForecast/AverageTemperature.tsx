"use client"

type Props = {
    avgTemp: number
}

export default function DisplayAverageTemp({avgTemp}: Props) {
    return (
        <div className="text-center">
            Средняя температура: {avgTemp}°C
        </div>
    )
}