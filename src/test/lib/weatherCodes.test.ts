import { describe, it, expect } from 'vitest'
import { weatherCodes } from '@/lib/weatherCodes'

describe('weatherCodes', () => {
    it('возвращает строку для известного кода', () => {
        expect(weatherCodes[0]).toBe('Ясно')
        expect(weatherCodes[63]).toBe('Умеренный дождь')
        expect(weatherCodes[95]).toBe('Гроза')
    })

    it('возвращает undefined для несуществующего кода', () => {
        expect(weatherCodes[-1]).toBeUndefined()
        expect(weatherCodes[4]).toBeUndefined()
        expect(weatherCodes[1000]).toBeUndefined()
    })
})