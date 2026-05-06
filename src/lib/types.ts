export enum unitSystem {
    "EU" = "EU",
    "US" = "US"
}

export enum temperatureUnit {
    "C" = "C",
    "F" = "F"
}

export type City = {
    id: number,
    name: string,
    country: string,
    latitude: number,
    longitude: number
}

export const CITIES: City[] = [
    { id: 2950159, name: "Берлин", country: "Германия", latitude: 52.52, longitude: 13.40 },
    { id: 2988507, name: "Париж", country: "Франция", latitude: 48.85, longitude: 2.35 },
    { id: 2643743, name: "Лондон", country: "Великобритания", latitude: 51.51, longitude: -0.13 },
]