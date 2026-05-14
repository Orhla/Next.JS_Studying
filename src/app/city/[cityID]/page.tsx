import CityDailyWeatherCard from "@/components/weather/CityDailyWeatherCard";
import { notFound } from "next/navigation";
import { fetchCityIDSearch } from "@/lib/geocoding-api";
import FeedbackForm from "@/components/feedback/FeedbackForm";

export default async function CityWeekForecast({params}: {params: Promise<{cityID: string}>}) {
    const rawParams = await params
    let city
    try {
        city = await fetchCityIDSearch(rawParams.cityID);
    } catch (error) {
        console.error(error);
        notFound();
    }

    return (
        <div className="flex">
            <CityDailyWeatherCard city={city} />
            <div className="flex flex-col">
                <p>Данные неточные? Сообщи нам!</p>
                <FeedbackForm />
            </div>
        </div>
    )
}
