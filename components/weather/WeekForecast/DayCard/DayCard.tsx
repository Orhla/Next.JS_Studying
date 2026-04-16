"use client"

import { Day } from "@/lib/weather"
import DisplayTempRange from "./TempRange"
import Link from "next/link"

type Props = {
    key: number,
    day: Day,
    todayDate: string
}

export default function DayCard({day, todayDate}: Props) {
    if (day.date === todayDate) {
        return (<Link href={`/day/${day.date}`}>
                <div className="flex border-3 border-double border-red-500 rounded-md p-4 gap-4">
                    <span>
                    {new Date(Date.parse(day.date)).toLocaleDateString('ru-RU', {weekday: "long", day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <DisplayTempRange tempMin={day.tempMin}
                                      tempMax={day.tempMax} />
                </div>
            </Link>)
    }
    else {
        return (<Link href={`/day/${day.date}`}>
                <div className="flex border rounded-md p-4 gap-4">
                    <span>
                    {new Date(Date.parse(day.date)).toLocaleDateString('ru-RU', {weekday: "long", day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <DisplayTempRange tempMin={day.tempMin}
                                      tempMax={day.tempMax} />
                </div>
            </Link>)
    }
}