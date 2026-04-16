"use client"

type Props = {
    humidity: number
}

export default function DisplayHumidity({humidity}: Props) {
    return (
        <div>
            Влажность: {humidity}%
        </div>
    );
}