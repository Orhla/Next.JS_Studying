"use server"

import {
    CurrentWeather,
    DailyWeather,
    fetchCityWeather, WeatherError,
    fetchCityDailyWeather
} from "@/lib/weather-api"
import { City } from "@/lib/types";


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
        // if (error instanceof TypeError && error.cause?.code === "ECONNREFUSED") {
        //     throw error
        // }
        throw error
        // return undefined
        // something
    }
}


export async function getCityDailyWeatherAction(city: City): Promise<DailyWeather[]> {
    try {
        return fetchCityDailyWeather(city);        
    } catch (error) {
        console.error("Fetch error: ", error);
        if (error instanceof SyntaxError) {
            throw new WeatherError("Weather not found");
        }
        throw error
    }
}




