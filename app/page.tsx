import {getAllDaysWeather} from "@/app/actions/weather";
import {calcAverageTemp} from '@/lib/weather'
import WeatherDashboardWrapper from "@/components/weather/WeekForecast/WeatherDashboardWrapper";

export default async function Home() {
  const allDaysWeather = await getAllDaysWeather();
  const averageTemp = await calcAverageTemp(allDaysWeather);

  return (
    <WeatherDashboardWrapper forecast={allDaysWeather}
                             avgTemp={averageTemp}/>
  );

    // return (<>
    //           <DisplayAverageTemp avgTemp={averageTemp}
    //                               unit="C"
    //                               onToggle />
    //           <WeatherDashboard
    //               forecast={allDaysWeather}
    //           />
    //         </>);
}
