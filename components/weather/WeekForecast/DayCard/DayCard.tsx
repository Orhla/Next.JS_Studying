"use client"

import { formatDate} from "@/lib/weather"
import DisplayTempRange from "./TempRange"
import Link from "next/link"
import {Day} from "@/app/actions/types";
import { temperatureUnit } from "@/lib/types";

type Props = {
    day: Day,
    unit: temperatureUnit
}

export default function DayCard({day, unit}: Props) {
    const today: string = formatDate(new Date())

    return (
        <Link href={`/day/${day.date}`}>
            <div className={`flex border-3 rounded-md p-4 gap-4 ${day.date === today ? 'border-double border-red-500' : ''}`}>
                <span>
                    {new Date(Date.parse(day.date)).toLocaleDateString('ru-RU', {weekday: "long", day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <DisplayTempRange tempMin={day.tempMin}
                                  tempMax={day.tempMax}
                                  unit={unit} />
            </div>
        </Link>)
}
