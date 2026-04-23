# Домашнее задание 5: Провайдеры данных

## Важное предупреждение

Эта домашка — почти полный рефактор приложения. Это не значит что предыдущий код был плохим — просто мы узнали некоторые
концепты и будем сейчас их активнее применять. Профессиональный разработчик переписывает код постоянно. Сохрани старую ветку
если хочешь.

---

## Цель

Разделить приложение на два независимых потока данных:

| | Кто фетчит | Откуда берёт город | Когда выполняется |
|---|---|---|---|
| **Серверный провайдер** | сервер | куки | при загрузке страницы |
| **Клиентский провайдер** | браузер | localStorage | после загрузки JS |

Оба провайдера показывают данные через **один и тот же** компонент `CityWeatherCard`.

---

## Концепт: что такое провайдер

Провайдер — это слой, который знает **откуда взять данные** и **в каком виде их отдать**. Он не знает как данные будут показаны.

```
Серверный провайдер:
  куки → город → fetch API → данные → CityWeatherCard

Клиентский провайдер:
  localStorage → список городов → fetch API → данные → CityWeatherCard
```

`CityWeatherCard` получает уже готовые данные — ему всё равно откуда они пришли.

---

## Структура файлов

Вот какие файлы нужно создать. Функции внутри — твоя задача.

```
lib/
  weather-api.ts            ← buildUrl + map, без директив
app/
  page.tsx                  ← серверный компонент, читает куки
  actions/
    weather-provider.ts     ← "use server", серверный fetch
  set-city/
    page.tsx                ← уже есть с урока
    CitySelectorForm.tsx    ← уже есть с урока
    actions.ts              ← уже есть с урока
api/
  weather.ts                ← без директив, чистый fetch → данные, вызывается из клиента
components/
  weather/
    CityWeatherCard.tsx     ← отображает погоду, не знает откуда данные
    ClientCities.tsx        ← "use client", useState + useEffect, вызывает api/weather.ts
```

---

## Часть 1: Общий слой — `lib/weather-api.ts`

Этот файл — переиспользуемый. Его используют и серверный, и клиентский провайдер.

**Тип данных:**
```ts
export type CurrentWeather = {
    cityName: string
    temperature: number
    weatherCode: number
    windSpeed: number
}
```

**Что нужно написать:**

`buildCurrentWeatherUrl(city: City): string`
— принимает город, возвращает готовый URL к open-meteo.

Параметры которые нужны: `current=temperature_2m,weather_code,wind_speed_10m`

`mapCurrentWeather(cityName: string, data: unknown): CurrentWeather`
— принимает сырой ответ API и название города, возвращает `CurrentWeather`.

Посмотри на структуру ответа API в браузере — данные лежат внутри объекта `current`.

> Почему эти функции отдельно? Потому что URL и маппинг не меняются — меняется только *кто* делает fetch. Если завтра поменяется API — правишь один файл, а не везде.

---

## Часть 2: `components/weather/CityWeatherCard.tsx`

Простой компонент. Получает `CurrentWeather` и показывает его.

```ts
type Props = {
    weather: CurrentWeather
}
```

Показывает: название города, температуру, описание погоды (`weatherCodes[weatherCode]`), ветер.

Никаких хуков, никакого fetch. Просто рендер.

---

## Часть 3: Серверный провайдер — `app/page.tsx`

На уроке мы уже написали чтение куки и редирект. Теперь добавляем фетч.

**Логика:**
1. Читаем куку `userCity`
2. Если нет — `redirect('/set-city')`
3. Если есть — находим город в `CITIES` по имени
4. Фетчим погоду через `buildCurrentWeatherUrl` + `mapCurrentWeather`
5. Рендерим `CityWeatherCard` с результатом

```tsx
// Подсказка: в серверном компоненте async/await работает прямо в теле
export default async function Home() {
    const cookieStore = await cookies()
    // ...
    const response = await fetch(buildCurrentWeatherUrl(city))
    // ...
}
```

**Обработка ошибок — обязательно:**

На сервере нет состояния загрузки — страница либо вернулась, либо нет. Но fetch может упасть. Оберни в `try/catch`:

```tsx
try {
    const weather = await fetchWeather(city)
    return <CityWeatherCard weather={weather} />
} catch {
    return <div>Не удалось загрузить погоду. Попробуй позже.</div>
}
```

---

## Часть 4: Клиентский слой — `api/weather.ts` + `components/weather/ClientCities.tsx`

На уроке мы написали `AdditionalCities` — он читает localStorage и показывает список. Теперь разобьём это на два слоя: чистый fetch в `api/weather.ts`, и компонент который его вызывает.

**Логика:**
1. Читаем localStorage при загрузке (`useEffect` с `[]`)
2. Для каждого города — делаем fetch
3. Показываем `CityWeatherCard` для каждого результата

**Три состояния — обязательно:**

На клиенте fetch происходит уже после рендера, поэтому у компонента есть три чётких состояния. Пользователь должен видеть каждое из них:

| Состояние | Что показываем |
|-----------|---------------|
| `loading: true` | спиннер или текст "Загрузка..." |
| `error: string` | сообщение об ошибке |
| данные загружены | список `CityWeatherCard` |

Подсказка по структуре стейта:

```tsx
type Status =
    | { kind: "loading" }
    | { kind: "error"; message: string }
    | { kind: "ready"; weathers: CurrentWeather[] }

const [status, setStatus] = useState<Status>({ kind: "loading" })
```

Такой подход лучше трёх отдельных `useState` — невозможно оказаться в состоянии `loading: true` и `error: "..."` одновременно.

В `useEffect` — выставляй нужный статус в зависимости от результата:
- до запроса: `{ kind: "loading" }`
- запрос упал: `{ kind: "error", message: "..." }`
- данные пришли: `{ kind: "ready", weathers: [...] }`

В рендере — `switch` или цепочка `if` по `status.kind`.

**Добавь кнопку удаления города** — при клике удаляет из localStorage и из стейта.

---

## Часть 5: Собираем в `app/page.tsx`

После серверного блока с основным городом — добавь `ClientCities`:

```tsx
return (
    <main>
        <CityWeatherCard weather={weather} />
        <ClientCities />
    </main>
)
```

`ClientCities` — клиентский компонент внутри серверной страницы. Это нормально и правильно.

---

## Финальный босс (не обязательно)

При клике на `CityWeatherCard` — переход на `/city/[name]`.

На этой странице:
- Текущая погода (уже умеем)
- Прогноз на 5 дней — добавь параметр `&daily=temperature_2m_max,temperature_2m_min,weather_code` к запросу

Город берётся из URL-параметра `name`, ищется в `CITIES`.

---

## Итог: что ты сделала

| Концепт | Где |
|---------|-----|
| Серверный компонент с async fetch | `app/page.tsx` |
| Куки + redirect | `app/page.tsx` + `set-city/actions.ts` |
| Переиспользуемый слой данных | `lib/weather-api.ts` |
| Клиентский fetch без директив | `api/weather.ts` |
| localStorage + рендер | `ClientCities.tsx` |
| `Promise.all` для параллельных запросов | `ClientCities.tsx` |
| Loading и error states | `ClientCities.tsx` |
| Try/catch на сервере | `app/page.tsx` |
| Компонент без знания об источнике данных | `CityWeatherCard.tsx` |
