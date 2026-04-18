import { getWeatherForDay } from "@/app/actions/weather";
import {notFound} from "next/navigation";
import DayDetailWrapper from "@/components/weather/DayDetail/DayDetailWrapper";

export default async function DayForecast({params}: {params: Promise<{date: string}>}) {
    const rawParams = await params
    const searchDate = rawParams.date;

    const day = await getWeatherForDay(searchDate).catch(()=>{return null});
    if (!day) {
        return notFound()
    }

    return (<DayDetailWrapper day={day}/>);
}
