"use client"

import { useState } from "react"
import { Day } from "@/app/actions/types"
import DayDetail from "./DayDetail"

type Props = {
    day: Day;
}

export default function DayDetailWrapper({day}: Props) {
    const [unit, setUnit] = useState<"C" | "F">("C");
    const toggleUnit = () => setUnit(unit === "C" ? "F" : "C");

    return (
        <DayDetail day={day}
                   unit={unit}
                   onToggle={toggleUnit} />
    )
}