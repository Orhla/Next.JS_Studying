import { prisma } from '@/lib/prisma'
import { validateWeatherString } from '@/lib/weather';

export default async function FeedbackList() {

    const feedbacks = await prisma.feedback.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
    })

    if (feedbacks.length === 0) {
        return <p className="text-gray-500">Отзывов пока нет</p>
    }

    return (
        <ul className="flex flex-col gap-2">
            {feedbacks.map((fb) => (
                <li key={fb.id} className="border rounded-md p-3 text-sm">
                    <span className="font-medium">{fb.name}</span>
                    {' — '}
                    {fb.temperature}°C, {validateWeatherString(fb.weather)}
                </li>
            ))}
        </ul>
    )
}
