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
        <main className="max-w-6xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">{city.name}, {city.country}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CityDailyWeatherCard city={city} />
                </div>
                <div className="flex flex-col gap-6">
                    <div>
                        <p className="font-semibold text-lg mb-3">Данные неточные? Сообщи нам!</p>
                        <FeedbackForm />
                    </div>
                    <div>
                        <p className="font-semibold text-lg mb-3">Последние отзывы</p>
                        <FeedbackList />
                    </div>
                </div>
            </div>
        </main>
    )
}
