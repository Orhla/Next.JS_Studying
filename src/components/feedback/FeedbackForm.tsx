"use client"

import { submitFeedbackValidation } from '@/app/actions/feedback'
import { validWeather } from '@/app/actions/types'
import { useState } from 'react'

export default function FeedbackForm() {

    const [userName, setUserName] = useState<string>('')
    const [temperature, setTemperature] = useState<number>(0)
    const [weather, setWeather] = useState<string>('sunny')
    const [clientError, setClientError] = useState<string | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setClientError(null);
        setServerError(null);
        setSuccess(false);

        if (!userName.trim()) {
            setClientError("Имя не может быть пустым");
            return;
        }

        if (userName.length < 2) {
            setClientError("Имя не может быть короче двух символов");
            return;
        }

        if (temperature < -50 || temperature > 50) {
            setClientError("Температура не может быть меньше -50 и больше 50 градусов");
            return;
        }

        setIsLoading(true);

        try {
            const result = await submitFeedbackValidation({"userName": userName, "temperature": temperature, "weather": weather});
            if (result.success) {
                setSuccess(true);
            }
            else {
                setServerError(result.error);
                setSuccess(false);
            }
        } catch (error) {
            setServerError(error instanceof Error ? error.message : 'Неизвестная ошибка')
            console.error(`Ошибка при отправке данных на сервер: ${error}`);
        } finally {
            setIsLoading(false);
        }    
    }

    return (
        <div>
            {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-gray-700">Ваше имя</span>
                    <input name="userName"
                        type="text"
                        value={userName}
                        className="border border-gray-300 p-2 rounded-md w-full"
                        onChange={(e) => setUserName(e.target.value)} />
                </label>

                <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-gray-700">Фактическая температура</span>
                    <input name="temperature"
                        type="number"
                        value={temperature}
                        className="border border-gray-300 p-2 rounded-md w-full"
                        onChange={(e) => setTemperature(Number(e.target.value))} />
                </label>

                <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-gray-700">Фактическая погода</span>
                    <select name="weather"
                        value={weather}
                        className="border border-gray-300 p-2 rounded-md w-full"
                        onChange={(e) => setWeather(e.target.value)}>
                        {Object.entries(validWeather).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </label>

                {clientError && <p className="text-red-500 text-sm">{clientError}</p>}
                {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

                <button type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 w-full">
                    {isLoading ? "Отправляем..." : "Отправить"}
                </button>
            </form> ) : (
                <p className="text-green-600 text-sm">Спасибо! Мы получили Ваш отзыв.</p>
            )}
        </div>
    )
}