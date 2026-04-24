export enum unitSystem {
    "EU" = "EU",
    "US" = "US"
}

export enum temperatureUnit {
    "C" = "C",
    "F" = "F"
}

export type City = {
    name: string,
    latitude: number,
    longitude: number
}

export const CITIES: City[] = [
    { name: "Берлин", latitude: 52.52, longitude: 13.40 },
    { name: "Париж", latitude: 48.85, longitude: 2.35 },
    { name: "Лондон", latitude: 51.51, longitude: -0.13 },
]