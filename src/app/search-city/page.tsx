import CitySearch from "@/components/weather/CitySearch"

export default async function SearchCity() {
    return (
        <div className="flex flex-col gap-4 w-180 mx-auto">
            <CitySearch />
        </div>)
}