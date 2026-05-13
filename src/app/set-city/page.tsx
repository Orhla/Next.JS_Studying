import CitySearch from "@/components/weather/CitySearch";

export default function SetCityPage() {
    return (
        <div className="flex flex-col gap-4 w-180 mx-auto">
            <h1>Выберите город</h1>
            <CitySearch />
        </div>
    )
}