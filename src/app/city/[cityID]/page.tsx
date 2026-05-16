import CityDailyWeatherCard from "@/components/weather/CityDailyWeatherCard";
import { notFound } from "next/navigation";
import { fetchCityIDSearch } from "@/lib/geocoding-api";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import FeedbackList from "@/components/feedback/FeedbackList";

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
                <p className="font-semibold">Данные неточные? Сообщи нам!</p>
                <FeedbackForm />
                <p className="font-semibold mt-4">Последние отзывы</p>
                <FeedbackList />
            </div>
        </div>
    )
}
