"use server"

import {
    CurrentWeather,
    DailyWeather,
    // buildWeatherUrl,
    // mapCurrentWeather,
    buildWeekWeatherUrl,
    mapDailyWeather,
    buildCitySearchUrl,
    mapCitySearch,
    buildCityIDSearchUrl,
    mapCityIDSearch,
    fetchCityWeather, WeatherError
} from "@/lib/weather-api"
import { City } from "@/lib/types";

// class WeatherError extends Error {}

export async function getCityWeatherAction(city: City): Promise<CurrentWeather> {
    console.log("fetchCityWeather", city);
    try {
        return fetchCityWeather(city); // 3 diiferent errors
    } catch (error) {
        console.error("Fetch error: ", error);
        // error mapping
        if (error instanceof SyntaxError) {
            throw new WeatherError("Weather not found");
        }
        if (error instanceof TypeError && error.cause.code === "ECONNREFUSED") {
            throw error
        }
        throw error
        // return undefined
        // something
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
    // try {
    const response = await fetch(buildCityIDSearchUrl(cityID));
    if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status}`);
    }
    const cityData = await response.json();
    return mapCityIDSearch(cityID, cityData);
    // } catch (error) {
    //     console.error("Fetch error: ", error);
    //     throw new Error("Ошибка запроса");
    // }
}
