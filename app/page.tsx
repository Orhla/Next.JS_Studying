import {getAllDaysWeather} from "@/app/actions/weather";
import {calcAverageTemp} from '@/lib/weather'
// import WeatherDashboard from "@/components/weather/WeekForecast/WeatherDashboard";
import WeatherDashboard from "@/components/weather/WeekForecast/WeatherDashboard";

export default async function Home() {
  const allDaysWeather = await getAllDaysWeather();
  const averageTemp = await calcAverageTemp(allDaysWeather);

  return (
    <WeatherDashboard avgTemp={averageTemp}/>
  );
}
