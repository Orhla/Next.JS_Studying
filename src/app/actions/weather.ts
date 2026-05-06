import { CurrentWeather, DailyWeather, buildWeatherUrl, mapCurrentWeather, buildWeekWeatherUrl, mapDailyWeather, buildCitySearchUrl, mapCitySearch, buildCityIDSearchUrl, mapCityIDSearch } from "@/lib/weather-api"
import { City } from "@/lib/types";

export async function fetchCityWeather(city: City): Promise<CurrentWeather> {
    console.log("fetchCityWeather", city);
    try {
        const response = await fetch(buildWeatherUrl(city));
        // offline, timeout, response 400error, 401, , 500
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`)
        }
        const weatherData = await response.json();
        // json parsing error.
        return mapCurrentWeather(city.name, weatherData);
    } catch (error) {
        console.error("Fetch error: ", error);
        return {cityName: "", temperature: NaN, humidity: NaN, weatherCode: NaN, windSpeed: NaN};
    }
}


export async function fetchCityDailyWeather(city: City): Promise<DailyWeather[]> {
    try {
        const response = await fetch(buildWeekWeatherUrl(city));
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`);
        }
        const weatherData = await response.json();
        return mapDailyWeather(city.name, weatherData);
    } catch (error) {
        console.error("Fetch error: ", error);
        return [{date: "", cityName: "", maxTemp: NaN, minTemp: NaN, humidity: NaN, weatherCode: NaN, windSpeed: NaN}];
    }
}


export async function fetchCitySearch(cityName: string): Promise<City[]> {
    try {
        const response = await fetch(buildCitySearchUrl(cityName));
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`);
        }
        const cityData = await response.json();
        return mapCitySearch(cityName, cityData);
    } catch (error) {
        console.error("Fetch error: ", error);
        throw new Error("Ошибка запроса");
    }
}


export async function fetchCityIDSearch(cityID: string): Promise<City> {
    try {
        const response = await fetch(buildCityIDSearchUrl(cityID));
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`);
        }
        const cityData = await response.json();
        return mapCityIDSearch(cityID, cityData);
    } catch (error) {
        console.error("Fetch error: ", error);
        throw new Error("Ошибка запроса");
    }
}