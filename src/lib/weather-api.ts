import { City } from "@/lib/types"

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

function mapCurrentWeather(cityName: string, data: unknown): CurrentWeather {
    if (!data || typeof data !== "object") {
        console.error("Не пришли данные или пришли не те данные, что нужны", data);
        throw new WeatherError("Не пришли данные или пришли не те данные, что нужны");
    }

    if (!("current" in data) || typeof data.current !== "object" || data.current === null) {
        console.error("Нет данных о текущей погоде", data);
        throw new WeatherError("Нет данных о текущей погоде");
    }

    if (!("temperature_2m" in data.current) || !(typeof data.current.temperature_2m === "number")) {
        console.error("Неверный формат data.current", data.current);
        throw new WeatherError("Неверный формат data.current");
    }

    if (!("weather_code" in data.current) || !(typeof data.current.weather_code === "number")) {
        console.error("Неверный формат data.current", data.current);
        throw new WeatherError("Неверный формат data.current");
    }

    if (!("relative_humidity_2m" in data.current) || !(typeof data.current.relative_humidity_2m === "number")) {
        console.error("Неверный формат data.current", data.current);
        throw new WeatherError("Неверный формат data.current");
    }

    if (!("wind_speed_10m" in data.current) || !(typeof data.current.wind_speed_10m === "number")) {
        console.error("Неверный формат data.current", data.current);
        throw new WeatherError("Неверный формат data.current");
    }

    return  {
        cityName: cityName,
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m
    } satisfies CurrentWeather;
}

export function mapDailyWeather(cityName: string, data: unknown): DailyWeather[] {
    if (!data || typeof data !== "object") {
        console.log("Не пришли данные или пришли не те данные, что нужны", data);
        throw new WeatherError("Не пришли данные или пришли не те данные, что нужны");
    }

    if (!("daily" in data) || (typeof data.daily !== "object") || (data.daily === null)) {
        console.error("Нет данных о погоде на неделю", data);
        throw new WeatherError("Нет данных о погоде на неделю");
    }

    if (!("time" in data.daily) || !(Array.isArray(data.daily.time)) || !(data.daily.time.length > 0) || typeof data.daily.time[0] !== "string") {
        console.error("Нет даты в нужном формате в погоде на неделю", data.daily);
        throw new WeatherError("Нет даты в нужном формате в погоде на неделю");
    }

    if (!("temperature_2m_max" in data.daily) || !(Array.isArray(data.daily.temperature_2m_max)) || !(data.daily.temperature_2m_max.length > 0) || (typeof data.daily.temperature_2m_max[0] !== "number")) {
        console.error("Неверный формат data.daily", data.daily);
        throw new WeatherError("Неверный формат data.daily");
    }

    if (!("temperature_2m_min" in data.daily) || !(Array.isArray(data.daily.temperature_2m_min)) || !(data.daily.temperature_2m_min.length > 0) || (typeof data.daily.temperature_2m_min[0] !== "number")) {
        console.error("Неверный формат data.daily", data.daily);
        throw new WeatherError("Неверный формат data.daily");
    }

    if (!("weather_code" in data.daily) || !(Array.isArray(data.daily.weather_code)) || !(data.daily.weather_code.length > 0) || (typeof data.daily.weather_code[0] !== "number")) {
        console.error("Неверный формат data.daily", data.daily);
        throw new WeatherError("Неверный формат data.daily");
    }

    if (!("relative_humidity_2m_max" in data.daily) || !(Array.isArray(data.daily.relative_humidity_2m_max)) || !(data.daily.relative_humidity_2m_max.length > 0) || (typeof data.daily.relative_humidity_2m_max[0] !== "number")) {
        console.error("Неверный формат data.daily", data.daily);
        throw new WeatherError("Неверный формат data.daily");
    }

    if (!("wind_speed_10m_max" in data.daily) || !(Array.isArray(data.daily.wind_speed_10m_max)) || !(data.daily.wind_speed_10m_max.length > 0) || (typeof data.daily.wind_speed_10m_max[0] !== "number")) {
        console.error("Неверный формат data.daily", data.daily);
        throw new WeatherError("Неверный формат data.daily");
    }

    return data.daily.time.map((date, index) => ({
        cityName: cityName,
        date: date,
        maxTemp: Object(data.daily).temperature_2m_max[index],
        minTemp: Object(data.daily).temperature_2m_min[index],
        weatherCode: Object(data.daily).weather_code[index],
        humidity: Object(data.daily).relative_humidity_2m_max[index],
        windSpeed: Object(data.daily).wind_speed_10m_max[index]
    }));
}

export async function fetchCityWeather(city: City): Promise<CurrentWeather> {
    try {
        const response = await fetch(buildWeatherUrl(city));
        if (!response.ok) {
            if (response.status === 400) throw new WeatherError("Неверный запрос");
            if (response.status === 401) throw new WeatherError("Вы не авторизованы. Авторизуйтесь, чтобы продолжить.");
            if (response.status === 403) throw new WeatherError("Доступ запрещён");
            if (response.status === 404) throw new WeatherError("Данные не найдены");
            if (response.status >= 500) throw new WeatherError("Сервер https://open-meteo.com/ временно недоступен. Попробуйте повторить запрос позже.");
            throw new WeatherError(`Ошибка запроса: ${response.status}`)
        }
        const weatherData = await response.json();
        return mapCurrentWeather(city.name, weatherData);
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error("Ошибка парсинга JSON: ", error);
            console.error("Причина ошибки: ", error.cause)
            throw new WeatherError("Ошибка формата: не файл JSON");
        }
        if (error instanceof TypeError) {
            console.error("Сетевая ошибка", error);
            console.error("Причина ошибки: ", error.cause);
            let errorCode: string | unknown;

            if ('code' in error && typeof error.code === 'string') {
                errorCode = error.code;
            }
            if ('cause' in error && error.cause && typeof error.cause === 'object' && 'code' in error.cause) {
                errorCode = error.cause.code;
            }
            console.error("Код ошибки: ", errorCode);

            if (errorCode === 'ECONNREFUSED') {
                throw new WeatherError("Сервер отклонил соединение");
            }
            if (errorCode === 'ENOTFOUND') {
                throw new WeatherError("Сервер не найден");
            }
            if (errorCode === 'ETIMEDOUT') {
                throw new WeatherError("Превышено время ожидания");
            }

            throw new WeatherError("Сетевая ошибка");
        }
        console.error("Ошибка: ", error);
        throw new WeatherError(`Ошибка: ${error}`);
    }
}


export async function fetchCityDailyWeather(city: City): Promise<DailyWeather[]> {
    try {
        const response = await fetch(buildWeekWeatherUrl(city));
        if (!response.ok) {
            if (response.status === 400) throw new WeatherError("Неверный запрос");
            if (response.status === 401) throw new WeatherError("Вы не авторизованы. Авторизуйтесь, чтобы продолжить.");
            if (response.status === 403) throw new WeatherError("Доступ запрещён");
            if (response.status === 404) throw new WeatherError("Данные не найдены");
            if (response.status >= 500) throw new WeatherError("Сервер https://open-meteo.com/ временно недоступен. Попробуйте повторить запрос позже.");
            throw new WeatherError(`Ошибка запроса: ${response.status}`)
        }
        const weatherData = await response.json();
        return mapDailyWeather(city.name, weatherData);
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error("Ошибка парсинга JSON: ", error);
            console.error("Причина ошибки: ", error.cause)
            throw new WeatherError("Ошибка формата: не файл JSON");
        }
        if (error instanceof TypeError) {
            console.error("Сетевая ошибка", error);
            console.error("Причина ошибки: ", error.cause);
            let errorCode: string | unknown;

            if ('code' in error && typeof error.code === 'string') {
                errorCode = error.code;
            }
            if ('cause' in error && error.cause && typeof error.cause === 'object' && 'code' in error.cause) {
                errorCode = error.cause.code;
            }
            console.error("Код ошибки: ", errorCode);

            if (errorCode === 'ECONNREFUSED') {
                throw new WeatherError("Сервер отклонил соединение");
            }
            if (errorCode === 'ENOTFOUND') {
                throw new WeatherError("Сервер не найден");
            }
            if (errorCode === 'ETIMEDOUT') {
                throw new WeatherError("Превышено время ожидания");
            }

            throw new WeatherError("Сетевая ошибка");
        }
        console.error("Ошибка: ", error);
        throw new WeatherError(`Ошибка: ${error}`);
    }
}