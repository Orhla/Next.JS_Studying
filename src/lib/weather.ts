import {Day, validWeather} from "@/app/actions/types";
import { City } from "@/lib/types";

export async function calcAverageTemp(days: Day[]): Promise<number> {
  let sumTemp = 0;
  // todo: bad ((
  for (const day of days) {
    sumTemp += day.tempMax;
  }
  const daysCount = days.length;
  return Math.round(sumTemp / daysCount);
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function celsToFahr(cels: number): number {
  return Math.round((cels * 9 / 5) + 32);
}

export function kmPerHourToMPerSecond(speed: number): number {
  return Math.round(speed / 3.6);
}

export function kmPerHourToMilesPerHour(speed: number): number {
  return Math.round(speed * 0.6214);
}

export function datetoRussianLocale(dateISO: string): string {
  return (new Date(Date.parse(dateISO)).toLocaleDateString('ru-RU', {weekday: "long", day: 'numeric', month: 'long', year: 'numeric' }));
}

export function getCityFromCookies(cookieValue: string): City {
    try {
      return JSON.parse(decodeURIComponent(cookieValue)) as City;
    }
    catch (error) {
      if (error instanceof SyntaxError) {
          console.error("Not a JSON file", error);
          throw Error("Not a JSON file", error);
      }
      console.error("Unknown error: ", String(error));
      throw Error("Unknown error");
    }
}

export function validateWeatherString(weather: string): string {
    if (weather in validWeather) {
        return validWeather[weather as keyof typeof validWeather];
    }
    return weather;
}

export function getWeatherEmoji(code: number): string {
    if (code === 0) return "☀️";
    if (code <= 2) return "🌤️";
    if (code === 3) return "☁️";
    if (code <= 48) return "🌫️";
    if (code <= 57) return "🌦️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    if (code <= 82) return "🌧️";
    if (code <= 86) return "🌨️";
    return "⛈️";
}