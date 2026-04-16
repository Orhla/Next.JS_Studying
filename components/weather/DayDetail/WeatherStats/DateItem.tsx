"use client"

type Props = {
    date: string
}

export default function DisplayDate({date}: Props) {
    return (
        <div>
            Дата: {new Date(Date.parse(date)).toLocaleDateString('ru-RU', {weekday: "long", day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
    );
}