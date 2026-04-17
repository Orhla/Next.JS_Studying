import {getAllDaysWeather} from "@/app/actions/weather";
import {calcAverageTemp} from '@/lib/weather'
import WeekForecast from '@/components/weather/WeekForecast/WeekForecast';
import DisplayAverageTemp from '@/components/weather/WeekForecast/AverageTemperature';

export default async function Home() {
  const allDaysWeather = await getAllDaysWeather();
  const averageTemp = await calcAverageTemp(allDaysWeather);

    return (<div>
              <WeekForecast
                  forecast={allDaysWeather}
              />
              <DisplayAverageTemp avgTemp={averageTemp} />
            </div>);
}
