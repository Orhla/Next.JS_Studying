# Домашнее задание 9: Деплой, тесты, аналитика

## Тема урока

Статический экспорт Next.js, unit-тесты с Vitest и React Testing Library, Яндекс Метрика, деплой на Vercel.

---

## Контекст

Проект работает локально, но пока никто кроме тебя его не видит. Чтобы задеплоить бесплатно — нужно избавиться от серверной инфраструктуры: базы данных и cookies. Всё это заменяется на localStorage, который живёт прямо в браузере пользователя.

После этого — тесты и аналитика, и проект готов к показу.

---

## Часть 1: Статический экспорт

Добавь в `next.config.ts`:

```ts
const nextConfig: NextConfig = {
    output: 'export',
}
```

Запусти `npm run build`. Скорее всего сборка упадёт с ошибками — это ожидаемо. Ошибки покажут тебе, что именно нужно убрать или переписать.

> **Что такое статический экспорт?** Next.js собирает всё в обычные HTML/CSS/JS файлы, без сервера. Такой сайт можно положить на любой хостинг — Vercel, Netlify, GitHub Pages. Обратная сторона: всё что требует сервера (cookies, база данных, server actions) — не работает.

---

## Часть 2: Убираем серверную инфраструктуру

Удали следующее — оно не совместимо со статическим экспортом:

- `src/components/feedback/FeedbackForm.tsx`
- `src/components/feedback/FeedbackList.tsx`
- `src/app/actions/feedback.ts`
- `src/lib/prisma.ts`
- Блок с формой и отзывами в `src/app/city/[cityID]/page.tsx`

Prisma, Docker и всё связанное с базой данных больше не нужно. Можно также удалить `prisma/` и `src/generated/`.

---

## Часть 3: Город без cookies

Сейчас выбранный город хранится в cookie и читается серверным компонентом. В статическом экспорте сервера нет — нужно перейти на `localStorage`.

**Что нужно сделать:**

1. `CitySearchMain` при выборе города должен писать в `localStorage` вместо вызова `setCity`
2. Главная страница `app/page.tsx` сейчас серверный компонент — она должна стать клиентской и читать город из `localStorage`
3. Если город не выбран — редиректни на `/set-city` (или покажи inline предложение выбрать город — на твоё усмотрение)

Подсказка: `localStorage` доступен только в браузере, не во время SSR. Если получаешь ошибку `localStorage is not defined` — подумай, на каком этапе жизненного цикла компонента нужно его читать.

---

## Часть 4: Проверяем сборку

```bash
npm run build
```

Сборка должна пройти без ошибок. В папке `out/` появятся готовые статические файлы.

Проверь локально:

```bash
npx serve out
```

Пройди по основным сценариям: выбор города, поиск, просмотр прогноза, добавление дополнительных городов. Всё должно работать без `npm run dev`.

---

## Часть 5: Яндекс Метрика

1. Зарегистрируй счётчик на [metrika.yandex.ru](https://metrika.yandex.ru) — получишь числовой ID счётчика
2. Добавь скрипт в `src/app/layout.tsx` через `next/script`:

```tsx
import Script from 'next/script'

// внутри <body>:
<Script id="yandex-metrika" strategy="afterInteractive">
  {`
    // сюда вставь код счётчика из интерфейса Яндекс Метрики
  `}
</Script>
```

> `strategy="afterInteractive"` — скрипт загружается после того как страница стала интерактивной, не блокирует рендер.

3. Добавь трекинг события при выборе города в `CitySearchMain`:

```ts
window.ym?.(ТВОЙ_ID, 'reachGoal', 'city_selected')
```

Создай цель `city_selected` в интерфейсе Метрики (Цели → Добавить цель → JavaScript-событие).

---

## Часть 6: Тесты — настройка

Установи зависимости:

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Создай `vitest.config.ts` в корне проекта:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/test/setup.ts',
    },
    resolve: {
        alias: { '@': '/src' },
    },
})
```

Создай `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom'
```

Добавь в `package.json`:

```json
"scripts": {
    "test": "vitest"
}
```

---

## Часть 7: Тесты — библиотечные функции

Создай `src/test/lib/weatherCodes.test.ts`.

Вот один тест для примера — остальные напиши сама:

```ts
import { describe, it, expect } from 'vitest'
import { weatherCodes } from '@/lib/weatherCodes'

describe('weatherCodes', () => {
    it('возвращает строку для известного кода', () => {
        expect(weatherCodes[0]).toBe('Ясно')
    })
})
```

Что ещё нужно покрыть:
- Несколько разных кодов (дождь, снег, гроза)
- Что возвращается для неизвестного кода

Дальше — напиши тесты для `getWeatherEmoji` (она сейчас продублирована в двух компонентах — самое время вынести её в `src/lib/weather.ts` и тестировать оттуда).

Проверь граничные случаи: код `0`, код `99`, код которого нет в маппинге.

---

## Часть 8: Тесты — компоненты

Создай `src/test/components/CityWeatherCard.test.tsx`.

React Testing Library работает так: рендеришь компонент с тестовыми данными, потом проверяешь что появилось в DOM.

```ts
import { render, screen } from '@testing-library/react'
import CityWeatherCard from '@/components/weather/CityWeatherCard'

const mockWeather = {
    cityName: 'Берлин',
    temperature: 18.7,
    weatherCode: 0,
    humidity: 65,
    windSpeed: 12.3,
}
```

Что нужно проверить для `CityWeatherCard`:
- Название города отображается
- Температура округляется (`18.7` → `19°C`)
- Влажность и ветер присутствуют на странице

Дальше — напиши тесты для `CitySearch`:
- При вводе меньше 3 символов дропдаун не появляется
- При вводе 3+ символов вызывается `fetchCitySearch`

Для второго теста нужно замокать `fetchCitySearch`. Подсказка: в Vitest это делается через `vi.mock('@/lib/geocoding-api', ...)`.

---

## Часть 9: Деплой на Vercel

1. Запушь ветку на GitHub
2. Зайди на [vercel.com](https://vercel.com), подключи репозиторий
3. Vercel автоматически определит Next.js — нажми Deploy

Если деплой упал — смотри логи в интерфейсе Vercel, они подскажут причину.

---

## Что должно получиться

1. `npm run build` проходит без ошибок, в `out/` лежат статические файлы
2. Выбранный город сохраняется между перезагрузками через `localStorage`
3. На [metrika.yandex.ru](https://metrika.yandex.ru) видны просмотры страниц
4. `npm test` запускает тесты, все зелёные
5. Проект открывается по публичному URL на Vercel

---

## Вопросы для размышления

- Чем статический экспорт отличается от обычного Next.js деплоя? Какие функции теряются?
- Почему `localStorage` нельзя читать на сервере — и что именно происходит если попробовать?
- Чем unit-тест отличается от того чтобы просто открыть страницу и проверить глазами?
- Что произойдёт с данными пользователя если он откроет приложение в другом браузере?
