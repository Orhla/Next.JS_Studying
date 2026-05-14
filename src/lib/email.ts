"use server"

import { Resend } from 'resend'

type FeedbackData = {
    userName: string
    temperature: number
    weather: string
}

export async function sendFeedbackEmail(data: FeedbackData): Promise<void> {    

    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY не настроен')
    }

    if (!process.env.FEEDBACK_EMAIL) {
        throw new Error('FEEDBACK_EMAIL не настроен')
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
        from: 'onboarding@resend.dev', 
        to: process.env.FEEDBACK_EMAIL, 
        subject: `Отзыв о погоде от ${data.userName}`,
        text: `
Имя: ${data.userName}
Фактическая температура: ${data.temperature}°C
Погода: ${data.weather}
        `.trim()
    })

    if (error) {
        throw new Error(`Не удалось отправить письмо: ${error.message}`)
    }
}