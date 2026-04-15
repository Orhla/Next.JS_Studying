import forecastData from '../data/forecast.json';

export type Day = {
  date: string;
  tempMin: number;
  tempMax: number;
  description: string;
  humidity: number;
  wind: number;
};

export async function getForecast(): Promise<Day[]> {
  const days: Day[] = forecastData;
  return days;
}

export async function findToday(forecast: Day[]): Promise<Day | null> {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  for (const day of forecast) {
    if (day.date === todayStr)
      return day;
  }
  return null;
}

export function findDay(forecast: Day[], searchDate: string | undefined): Day | null {
  for (const day of forecast) {
    if (day.date === searchDate)
      return day;
  }
  return null;
}

export async function calcAverageTemp(forecast: Day[]) {
  let sumTemp = 0;
  for (const day of forecast) {
    sumTemp += day.tempMax;
  }
  const daysCount = forecast.length;
  return Math.round(sumTemp / daysCount);
}