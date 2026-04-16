"use client"

type Props = {
    description: string
}

export default function DisplayDescription({description}: Props) {
    return (
        <div>
            Погода: {description}
        </div>
    )
}