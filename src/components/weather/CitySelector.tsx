"use client"

import { City, CITIES } from "@/lib/types"

type Props = {
    selectedCity: City
    onCityChange: (city: City) => void
}

export default function CitySelector({selectedCity, onCityChange}: Props) {
    return (
        <select value={selectedCity.name}
                onChange={(e) => {
                            const city = CITIES.find(c => c.name === e.target.value)
                            if (city) onCityChange(city)
                          }}>
            {CITIES.map(city => (
                <option key={city.name} value={city.name}>{city.name}</option>
            ))}
        </select>
    );
}