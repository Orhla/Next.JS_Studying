"use client"

type Props = {
    tempMax: number
}

export default function MaxTemp({tempMax}: Props) {
    return (<div>
                Максимальная температура: {tempMax}
            </div>
           );
}