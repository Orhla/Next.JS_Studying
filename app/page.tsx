import {getForecast, findToday, calcAverageTemp} from '../lib/weather'
import WeekForecast from '@/components/weather/WeekForecast/WeekForecast';
import DisplayAverageTemp from '@/components/weather/WeekForecast/AverageTemperature';

export default async function Home() {



  const forecast = await getForecast();
  const todayDay = await findToday(forecast);
  const averageTemp = await calcAverageTemp(forecast);
  if (todayDay) {
    return (<div>
              <WeekForecast forecast={forecast}
                            todayDate={todayDay?.date} 
              />
              <DisplayAverageTemp avgTemp={averageTemp} />
            </div>);
  }
  else {
    return (<div>
              <WeekForecast forecast={forecast}
                            todayDate="2026-04-13" 
              />
              <DisplayAverageTemp avgTemp={averageTemp} />
            </div>);
  }
    
  // return (
    
  //     <div className="flex flex-col justify-center-safe h-screen w-200 mx-auto">
  //       <div className="flex flex-col gap-4 justify-center-safe h-screen w-200 mx-auto">
  //         {forecast.map((day, index) => (
  //           <Link key={index}
  //                 href={`/day/${day.date}`}>
  //             <div 
  //                 className="flex border rounded-md p-4 gap-4">
  //               <span>
  //                 {new Date(Date.parse(day.date)).toLocaleDateString('ru-RU', {weekday: "long", day: 'numeric', month: 'long', year: 'numeric' })}
  //               </span>
  //               <span>
  //                 Погода: {day.description}
  //               </span>
  //               <span>
  //                 Влажность: {day.humidity}%
  //               </span>
  //               <span>
  //                 Минимальная температура: {day.tempMin}
  //               </span>
  //               <span>
  //                 Максимальная температура: {day.tempMax}
  //               </span>
  //               <span>
  //                 Ветер: {day.wind} км/ч
  //               </span>
  //             </div>
  //           </Link>
  //         ))}
  //       </div>
      
  //     <div>
  //       Сегодняшняя дата: {todayDay?.date}
  //     </div>
  //     <div>
  //       Средняя температура: {averageTemp}
  //     </div>
  //   </div>);
}