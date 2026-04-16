import Link from 'next/link';
import {getForecast, findToday, calcAverageTemp} from '../lib/weather'

export default async function Home() {



  const forecast = await getForecast();
  const todayDay = await findToday(forecast);
  const averageTemp = await calcAverageTemp(forecast);
  return (
    
      <div className="flex flex-col justify-center-safe h-screen w-200 mx-auto">
        <div className="flex flex-col gap-4 justify-center-safe h-screen w-200 mx-auto">
          {forecast.map((day, index) => (
            <Link key={index}
                  href={`/day/${day.date}`}>
              <div 
                  className="flex border rounded-md p-4 gap-4">
                <span>
                  {new Date(Date.parse(day.date)).toLocaleDateString('ru-RU', {weekday: "long", day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span>
                  Погода: {day.description}
                </span>
                <span>
                  Влажность: {day.humidity}%
                </span>
                <span>
                  Минимальная температура: {day.tempMin}
                </span>
                <span>
                  Максимальная температура: {day.tempMax}
                </span>
                <span>
                  Ветер: {day.wind} км/ч
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