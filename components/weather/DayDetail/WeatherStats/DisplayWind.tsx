"use client"

type Props = {
    wind: number
}

export default function DisplayWind({wind}: Props) {
    // props drilling.
    return (
        <div>
            Ветер: {wind}км/ч
        </div>
    );
}
