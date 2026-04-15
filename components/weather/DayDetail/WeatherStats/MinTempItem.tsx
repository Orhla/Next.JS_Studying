"use client"

type Props = {
    tempMin: number
}

export default function MinTemp({tempMin}: Props) {
    return (<div>
                Минимальная температура: {tempMin}
            </div>
           );
}