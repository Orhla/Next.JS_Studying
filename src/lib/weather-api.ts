import { City } from "./types"

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

type CitySearchResponse = {
    results?: {
        id: number;
        name: string;
        country: string;
        latitude: number;
        longitude: number;
    }[]
}

type CityIDSearchResponse = {
        id: number;
        name: string;
        country: string;
        latitude: number;
        longitude: number;
}

export class WeatherError extends Error {}

function buildWeatherUrl(city: City): string {
    const baseUrl = 'https://api.open-meteo.com/v1/forecast';
    const params = new URLSearchParams({
        latitude: city.latitude.toString(),
        longitude: city.longitude.toString(),
        current: 'temperature_2m,wind_speed_10m,weather_code,relative_humidity_2m',
        timezone: 'auto'
    });
    return `${baseUrl}?${params.toString()}`;
}

export async function fetchCityWeather(city: City): Promise<CurrentWeather> {
    const response = await fetch(buildWeatherUrl(city));
    if (!response.ok) {
        throw new WeatherError(`Ошибка запроса: ${response.status}`)
    }
    const weatherData = await response.json();
    return mapCurrentWeather(city.name, weatherData);
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

export function buildCitySearchUrl(cityName: string): string {
    const baseUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    const params = new URLSearchParams({
        name: cityName,
        count: "5",
        language: "ru",
        format: "json"
    });
    return `${baseUrl}?${params.toString()}`;
}

export function buildCityIDSearchUrl(cityID: string): string {
    const baseUrl = 'https://geocoding-api.open-meteo.com/v1/get';
    const params = new URLSearchParams({
        id: cityID,
        language: "ru",
        format: "json"
    });
    return `${baseUrl}?${params.toString()}`;
}

function mapCurrentWeather(cityName: string, data: unknown): CurrentWeather {
    if (!data || typeof data !== "object") {
        console.error("Не пришли данные или пришли не те данные, что нужны", data);
        throw WeatherError("Не пришли данные или пришли не те данные, что нужны");
    }
    if (!("current" in data) || typeof data.current !== "object" || data.current === null) {
        console.error("Нет данных о текущей погоде", data);
        throw WeatherError("Нет данных о текущей погоде");
    }

    if (!("temperature_2m" in data.current) || !(typeof data.current.temperature_2m === "number")) {
        console.error("Wrong data.current format", data.current);
        throw WeatherError("Wrong data.current format");
    }

    return  {
        cityName: cityName,
        temperature: data.current.temperature_2m, // good example
        weatherCode: data.current.weather_code as  number, // todo: bad. fix me
        humidity: data.current.relative_humidity_2m as  number,
        windSpeed: data.current.wind_speed_10m as  number
    } satisfies CurrentWeather;
}

export function mapDailyWeather(cityName: string, data: unknown): DailyWeather[] {
    if (!data || typeof data !== "object") {
        console.log("Не пришли данные или пришли не те данные, что нужны", data);
        throw Error("Не пришли данные или пришли не те данные, что нужны");
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
            throw Error("Not a JSON file", error);
        }
        console.log("Unknown error: ", String(error));
        throw Error("Unknown error");
    }
}

export function mapCitySearch(cityName: string, data: unknown): City[] {
    if (!data || typeof data !== "object") {
        console.log("Не пришли данные или пришли не те данные, что нужны", data);
        throw Error("Не пришли данные или пришли не те данные, что нужны");
    }

    try {
        const parsedData = data as CitySearchResponse;
        if (!parsedData.results) return [];
        return parsedData.results.map((city) => ({
            id: city.id,
            name: city.name,
            country: city.country,
            latitude: city.latitude,
            longitude: city.longitude
        }));
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw Error("Not a JSON file", error);
        }
        console.log("Unknown error: ", String(error));
        throw Error("Unknown error");
    }
}


export function mapCityIDSearch(cityID: string, data: unknown): City {
    if (!data || typeof data !== "object") {
        console.log("Не пришли данные или пришли не те данные, что нужны", data);
        throw Error("Не пришли данные или пришли не те данные, что нужны");
    }

    try {
        const parsedData = data as CityIDSearchResponse;
        const city: City = {country: parsedData.country, id: parsedData.id, latitude: parsedData.latitude,
                            longitude: parsedData.longitude, name: parsedData.name}
        return city;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw Error("Not a JSON file", error);
        }
        console.log("Unknown error: ", String(error));
        throw Error("Unknown error");
    }
}

