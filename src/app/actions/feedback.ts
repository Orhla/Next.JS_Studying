"use server"
import { sendFeedbackEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'
import { validWeather } from '@/app/actions/types'

type ActionResult =
| {success: true}
| {success: false, error: string}

export async function submitFeedbackValidation(data: unknown): Promise<ActionResult> {
    try {
        if (!data || typeof data !== 'object') {
            return {success: false, error: "Некорректный формат данных"}
        }

        if (!("userName" in data) || typeof data.userName !== 'string' || data.userName.length < 2) {
            return {success: false, error: "Некорректный формат имени. Имя должно быть строкой и содержать не менее двух символов."}
        }

        if (!("temperature" in data) || typeof data.temperature !== 'number' || data.temperature < -50 || data.temperature > 50) {
            return {success: false, error: "Некорректный формат температуры. Температура должна быть числом и лежать в диапазоне [-50; 50]."}
        }

        if (!("weather" in data) || typeof data.weather !== 'string' || !(data.weather in validWeather)) {
            return {success: false, error: "Некорректный формат погоды. Погода может принимать значения: 'Солнечно', 'Облачно', 'Дождь'."}
        }

        await prisma.feedback.create({
            data: {
                name: data.userName,
                temperature: data.temperature,
                weather: data.weather,
            }
        })

        try {
            await sendFeedbackEmail({"userName": data.userName, "temperature": data.temperature, "weather": data.weather});
        } catch {
            console.error('Не удалось отправить уведомление на почту')
        }
        
        return {success: true}

    } catch (error) {
        return {success: false, error: `Ошибка сервера: ${error}`}
    }
}

export async function saveFeedback(data: {
    name: string
    temperature: number
    weather: string
}): Promise<ActionResult> {
    try {
        if (data.name.length < 2) {
            return { success: false, error: 'Имя слишком короткое' }
        }
        if (data.temperature < -50 || data.temperature > 50) {
            return { success: false, error: 'Температура вне допустимого диапазона' }
        }

        await prisma.feedback.create({ data })

        return { success: true }
    } catch {
        return { success: false, error: 'Ошибка сервера' }
    }
}