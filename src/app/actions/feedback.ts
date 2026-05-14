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

        const validWeather = ['sunny', 'cloudy', 'rainy'];
        if (!("weather" in data) || typeof data.weather !== 'string' || !validWeather.includes(data.weather)) {
            return {success: false, error: "Некорректный формат погоды. Погода может принимать значения: 'Солнечно', 'Облачно', 'Дождь'."}
        }

        return {success: true}

    } catch (error) {
        return {success: false, error: `Ошибка сервера: ${error}`}
    }
}