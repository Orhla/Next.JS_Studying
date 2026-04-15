import Link from 'next/link';
import {getForecast, findToday, calcAverageTemp} from '../lib/weather'

export default async function Home() {



  const forecast = await getForecast();
  const todayDay = await findToday(forecast);
  const averageTemp = await calcAverageTemp(forecast);
  return (
    
      <div className="flex flex-col justify-center-safe h-screen w-150 mx-auto">
        <div className="flex flex-col gap-4 justify-center-safe h-screen w-150 mx-auto">
          {forecast.map((day, index) => (
            <Link key={index}
                  href={`/day/${day.date}`}>
              <div 
                  className="flex border rounded-md p-4 gap-4">
                <span>
                  {new Date(Date.parse(day.date)).toLocaleDateString('ru-RU', {weekday: "long", day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span>
                  {day.description}
                </span>
                <span>
                  {day.humidity}
                </span>
                <span>
                  {day.tempMin}
                </span>
                <span>
                  {day.tempMax}
                </span>
                <span>
                  {day.wind}
                </span>
              </div>
            </Link>
          ))}
        </div>
      
      <div>
        Сегодняшняя дата: {todayDay?.date}
      </div>
      <div>
        Средняя температура: {averageTemp}
      </div>
    </div>);
}