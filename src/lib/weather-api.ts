import { City } from "./types"
import { notFound } from "next/navigation"

export type CurrentWeather = {
    cityName: string,
    temperature: number,
    weatherCode: number,
    humidity: number,
    windSpeed: number
}

export type DailyWeather = {
    cityName: string,
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
    humidity: number;
    windSpeed: number;
}

type WeatherDataResponse = {
    current: {
        temperature_2m: number;
        weather_code: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
    }
}

type WeatherDailyDataResponse = {
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weather_code: number[];
        wind_speed_10m_max: number[];
        relative_humidity_2m_max: number[];
    }
}

export function buildWeatherUrl(city: City, type: string='current'): string {
    // const baseUrl = 'https://api.open-meteo.com/v1/forecast';
    // const params = new URLSearchParams({
    //     latitude: city.latitude.toString(),
    //     longitude: city.longitude.toString(),
    //     daily: 'temperature_2m_max,temperature_2m_min,wind_speed_10m_max,weather_code,relative_humidity_2m_max',
    //     timezone: 'auto'
    // });
    // return `${baseUrl}?${params.toString()}`;
    const urlPath = 'https://api.open-meteo.com/v1/forecast?'
    return `${urlPath}latitude=${city.latitude}&longitude=${city.longitude}&${type}=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
}

export function buildWeekWeatherUrl(city: City): string {
    const baseUrl = 'https://api.open-meteo.com/v1/forecast';
    const params = new URLSearchParams({
        latitude: city.latitude.toString(),
        longitude: city.longitude.toString(),
        daily: 'temperature_2m_min,temperature_2m_max,wind_speed_10m_max,weather_code,relative_humidity_2m_max',
        timezone: 'auto'
    });
    return `${baseUrl}?${params.toString()}`;
}

export function mapCurrentWeather(cityName: string, data: unknown): CurrentWeather {
    if (!data || typeof data !== "object") {
        console.log("Не пришли данные или пришли не те данные, что нужны", data);
        return notFound();
    }
    
    try {
        const parsedData = data as WeatherDataResponse;
        const currentWeatherForCity: CurrentWeather = {
                                            cityName: cityName, temperature: parsedData.current.temperature_2m, weatherCode: parsedData.current.weather_code, 
                                            humidity: parsedData.current.relative_humidity_2m, windSpeed: parsedData.current.wind_speed_10m
                                            };
        return currentWeatherForCity;
    } catch (error: unknown) {
        if (error instanceof SyntaxError) {
            console.log("Not a JSON file");
            return notFound();
        }
        console.log("Unknown error: ", String(error));
        return notFound();
    }
}

export function mapDailyWeather(cityName: string, data: unknown): DailyWeather[] {
    if (!data || typeof data !== "object") {
        console.log("Не пришли данные или пришли не те данные, что нужны", data);
        return notFound();
    }
    
    try {
        const parsedData = data as WeatherDailyDataResponse;
        return parsedData.daily.time.map((date, index) => ({
            cityName: cityName,
            date: date,
            maxTemp: parsedData.daily.temperature_2m_max[index],
            minTemp: parsedData.daily.temperature_2m_min[index],
            weatherCode: parsedData.daily.weather_code[index],
            humidity: parsedData.daily.relative_humidity_2m_max[index],
            windSpeed: parsedData.daily.wind_speed_10m_max[index]
        }));
    } catch (error: unknown) {
        if (error instanceof SyntaxError) {
            console.log("Not a JSON file");
            return notFound();
        }
        console.log("Unknown error: ", String(error));
        return notFound();
    }
}