import { City } from "@/lib/types";

export class CityError extends Error {}

function buildCitySearchUrl(cityName: string): string {
    const baseUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    const params = new URLSearchParams({
        name: cityName,
        count: "5",
        language: "ru",
        format: "json"
    });
    return `${baseUrl}?${params.toString()}`;
}

function buildCityIDSearchUrl(cityID: string): string {
    const baseUrl = 'https://geocoding-api.open-meteo.com/v1/get';
    const params = new URLSearchParams({
        id: cityID,
        language: "ru",
        format: "json"
    });
    return `${baseUrl}?${params.toString()}`;
}

function mapCitySearch(data: unknown): City[] {
    if (!data || typeof data !== "object") {
        console.error("Не пришли данные или пришли не те данные, что нужны", data);
        throw new CityError("Не пришли данные или пришли не те данные, что нужны");
    }

    if (!("results" in data) || !(Array.isArray(data.results)) || (data.results === null)) {
        console.error("Нет данных о городах", data);
        return []
    }

    return data.results.map((city) => {

        if (!("id" in city) || typeof city.id !== "number") {
            console.error("Неверный формат data.results", data.results);
            throw new CityError("Неверный формат data.results");
        }

        if (!("name" in city) || typeof city.name !== "string") {
            console.error("Неверный формат data.results", data.results);
            throw new CityError("Неверный формат data.results");
        }

        if (!("country" in city) || typeof city.country !== "string") {
            console.error("Неверный формат data.results", data.results);
            throw new CityError("Неверный формат data.results");
        }

        if (!("latitude" in city) || typeof city.latitude !== "number") {
            console.error("Неверный формат data.results", data.results);
            throw new CityError("Неверный формат data.results");
        }

        if (!("longitude" in city) || typeof city.longitude !== "number") {
            console.error("Неверный формат data.results", data.results);
            throw new CityError("Неверный формат data.results");
        }

        return {
        id: city.id,
        name: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude
    }});
}


function mapCityIDSearch(data: unknown): City {
    if (!data || typeof data !== "object") {
        console.log("Не пришли данные или пришли не те данные, что нужны", data);
        throw new CityError("Не пришли данные или пришли не те данные, что нужны");
    }

    if (!("id" in data) || typeof data.id !== "number") {
            console.error("Нет данных о городе", data);
            throw new CityError("Нет данных о городе");
    }

    if (!("name" in data) || typeof data.name !== "string") {
            console.error("Нет данных о городе", data);
            throw new CityError("Нет данных о городе");
    }

    if (!("country" in data) || typeof data.country !== "string") {
            console.error("Нет данных о городе", data);
            throw new CityError("Нет данных о городе");
    }

    if (!("latitude" in data) || typeof data.latitude !== "number") {
            console.error("Нет данных о городе", data);
            throw new CityError("Нет данных о городе");
    }

    if (!("longitude" in data) || typeof data.longitude !== "number") {
            console.error("Нет данных о городе", data);
            throw new CityError("Нет данных о городе");
    }

    const city: City = {country: data.country, id: data.id, latitude: data.latitude,
                        longitude: data.longitude, name: data.name}
    return city;
}


export async function fetchCitySearch(cityName: string): Promise<City[]> {
    try {
        const response = await fetch(buildCitySearchUrl(cityName));
        if (!response.ok) {
            if (response.status === 400) throw new CityError("Неверный запрос");
            if (response.status === 401) throw new CityError("Вы не авторизованы. Авторизуйтесь, чтобы продолжить.");
            if (response.status === 403) throw new CityError("Доступ запрещён");
            if (response.status === 404) throw new CityError("Данные не найдены");
            if (response.status >= 500) throw new CityError("Сервер https://open-meteo.com/ временно недоступен. Попробуйте повторить запрос позже.");
            throw new CityError(`Ошибка запроса: ${response.status}`)
        }
        const cityData = await response.json();
        return mapCitySearch(cityData);
    } catch (error) {
            if (error instanceof SyntaxError) {
                console.error("Ошибка парсинга JSON: ", error);
                console.error("Причина ошибки: ", error.cause)
                throw new CityError("Ошибка формата: не файл JSON");
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
                    throw new CityError("Сервер отклонил соединение");
                }
                if (errorCode === 'ENOTFOUND') {
                    throw new CityError("Сервер не найден");
                }
                if (errorCode === 'ETIMEDOUT') {
                    throw new CityError("Превышено время ожидания");
                }
    
                throw new CityError("Сетевая ошибка");
            }
            console.error("Ошибка: ", error);
            throw new CityError(`Ошибка: ${error}`);
        }
}

export async function fetchCityIDSearch(cityID: string): Promise<City> {
    try {
        const response = await fetch(buildCityIDSearchUrl(cityID));
        if (!response.ok) {
            if (response.status === 400) throw new CityError("Неверный запрос");
            if (response.status === 401) throw new CityError("Вы не авторизованы. Авторизуйтесь, чтобы продолжить.");
            if (response.status === 403) throw new CityError("Доступ запрещён");
            if (response.status === 404) throw new CityError("Данные не найдены");
            if (response.status >= 500) throw new CityError("Сервер https://open-meteo.com/ временно недоступен. Попробуйте повторить запрос позже.");
            throw new CityError(`Ошибка запроса: ${response.status}`)
        }
        const cityData = await response.json();
        return mapCityIDSearch(cityData);
    } catch (error) {
            if (error instanceof SyntaxError) {
                console.error("Ошибка парсинга JSON: ", error);
                console.error("Причина ошибки: ", error.cause)
                throw new CityError("Ошибка формата: не файл JSON");
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
                    throw new CityError("Сервер отклонил соединение");
                }
                if (errorCode === 'ENOTFOUND') {
                    throw new CityError("Сервер не найден");
                }
                if (errorCode === 'ETIMEDOUT') {
                    throw new CityError("Превышено время ожидания");
                }
    
                throw new CityError("Сетевая ошибка");
            }
            console.error("Ошибка: ", error);
            throw new CityError(`Ошибка: ${error}`);
        }
}