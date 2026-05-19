export type Day = {
    date: string;
    tempMin: number;
    tempMax: number;
    description: string;
    humidity: number;
    wind: number;
};

export enum validWeather {
    sunny = "Солнечно",
    cloudy = "Облачно",
    rainy = "Дождь"
}