import { getWeatherForDay } from "@/app/actions/weather";
import {notFound} from "next/navigation";
import DayDetail from "@/components/weather/DayDetail/DayDetail";
import { City, CITIES, unitSystem } from "@/lib/types";

export default async function DayForecast({params}: {params: Promise<{date: string}>}) {
    const rawParams = await params
    const searchDate = rawParams.date;
    const city = CITIES[0];

    const day = await getWeatherForDay(searchDate, city).catch(()=>{return null});
    if (!day) {
        return notFound()
    }

    return (<DayDetail day={day}/>);
}
