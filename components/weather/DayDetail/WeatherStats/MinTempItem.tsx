"use client"

type Props = {
    tempMin: number
}

export default function DisplayMinTemp({tempMin}: Props) {
    return (<div>
                Минимальная температура: {tempMin}°C
            </div>
           );
}