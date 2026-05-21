import { describe, it, expect } from 'vitest'
import { getWeatherEmoji } from '@/lib/weather'

describe('getWeatherEmoji', () => {
    it('возвращает ☀️ для ясной погоды', () => {
        expect(getWeatherEmoji(0)).toBe('☀️')
    })

    it('возвращает правильный эмодзи для переменной облачности', () => {
        expect(getWeatherEmoji(1)).toBe('🌤️')
        expect(getWeatherEmoji(2)).toBe('🌤️')
    })

    it('возвращает правильный эмодзи для облачной погоды', () => {
        expect(getWeatherEmoji(3)).toBe('☁️')
    })

    it('возвращает правильный эмодзи при наличии тумана', () => {
        expect(getWeatherEmoji(48)).toBe('🌫️')
    })

    it('возвращает правильный эмодзи для лёгкой мороси', () => {
        expect(getWeatherEmoji(51)).toBe('🌦️')
    })

    it('возвращает правильный эмодзи для снега', () => {
        expect(getWeatherEmoji(71)).toBe('❄️')
        expect(getWeatherEmoji(75)).toBe('❄️')
    })

    it('возвращает одинаковый эмодзи для всех кодов дождя', () => {
        const codes = [61, 63, 65]
        codes.forEach(code => expect(getWeatherEmoji(code)).toBe('🌧️'))
    })
})