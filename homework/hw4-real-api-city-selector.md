# Домашнее задание 4: Реальный API, выбор города и система единиц

## Цель

Заменить фейковые данные из JSON на реальный прогноз погоды, добавить выбор города и переключатель систем единиц (Европа/Америка).

---

## Что у нас есть сейчас

В `WeatherDashboard.tsx` уже есть `useEffect` и `fetch`, которые мы писали вместе — они тянут текущую температуру Берлина. На этом и будем строить.

Данные о прогнозе пока берутся из JSON-файла через server action. Твоя задача — заменить их на реальный API.

---

## API, который мы будем использовать

[open-meteo.com](https://open-meteo.com) — бесплатный, без ключа.

Пример запроса для Берлина:
```
https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.40&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max&timezone=auto
```

Открой эту ссылку в браузере и посмотри на структуру ответа. Тебе понадобятся поля из объекта `daily`.

Координаты городов:
| Город | latitude | longitude |
|-------|----------|-----------|
| Берлин | 52.52 | 13.40 |
| Париж | 48.85 | 2.35 |
| Москва | 51.51 | -0.13 |

---

## Часть 1: Fetch реального прогноза

**Файл:** `components/weather/WeekForecast/WeatherDashboard.tsx`

Сейчас данные о прогнозе (`forecast`) приходят через пропс из JSON. Убери это — данные теперь будут приходить из API прямо в этот компонент.

### Шаги

**1. Добавь стейт для прогноза**

```tsx
const [forecast, setForecast] = useState<Day[]>([])
```

**2. Напиши функцию `fetchForecast`**

Она должна делать `fetch` к API и превращать ответ в массив `Day[]`.

Посмотри на структуру ответа API — там будет объект `daily` с массивами дат, температур и ветра. Тебе нужно будет пройтись по ним и собрать массив объектов.

Вот как выглядит маппинг:
```tsx
const days: Day[] = data.daily.time.map((date: string, index: number) => ({
    date: date,
    tempMax: data.daily.temperature_2m_max[index],
    tempMin: data.daily.temperature_2m_min[index],
    wind: data.daily.wind_speed_10m_max[index],
    // остальные поля типа Day — заглуши пока пустыми строками или 0
}))
```

**3. Вызови функцию в `useEffect`**

```tsx
useEffect(() => {
    fetchForecast().then(setForecast)
}, [])
```

Пустой массив `[]` означает: запустить один раз при загрузке компонента.

**4. Убери `forecast` из пропсов** — теперь он живёт в стейте

### Что должно получиться

- Прогноз загружается с реального API
- Карточки дней показывают реальные данные Берлина
- В консоли больше нет данных из JSON

---

## Часть 2: Выбор города

**Новый файл:** `components/weather/WeekForecast/CitySelector.tsx`

Добавь выпадающий список для выбора города. Когда пользователь меняет город — прогноз перезагружается.

### Новый концепт: зависимости в `useEffect`

Помнишь, мы ставили `[]` в конец `useEffect`? Это значит "запустить один раз".

Если добавить туда переменную — эффект будет перезапускаться каждый раз, когда она меняется:

```tsx
useEffect(() => {
    fetchForecast(selectedCity).then(setForecast)
}, [selectedCity]) // ← перезапустится при смене города
```

### Шаги

**1. В `WeatherDashboard` добавь стейт для города**

```tsx
type City = {
    name: string
    latitude: number
    longitude: number
}

const CITIES: City[] = [
    { name: "Берлин", latitude: 52.52, longitude: 13.40 },
    { name: "Париж", latitude: 48.85, longitude: 2.35 },
    { name: "Лондон", latitude: 51.51, longitude: -0.13 },
]

const [selectedCity, setSelectedCity] = useState<City>(CITIES[0])
```

**2. Обнови `fetchForecast` — пусть принимает город**

```tsx
const fetchForecast = async (city: City): Promise<Day[]> => { ... }
```

И используй `city.latitude`, `city.longitude` в URL.

**3. Обнови `useEffect` — добавь `selectedCity` в зависимости**

**4. Создай компонент `CitySelector`**

Он получает два пропса: текущий город и функцию для его смены.

```tsx
type Props = {
    selectedCity: City
    onCityChange: (city: City) => void
}
```

Внутри — обычный HTML `<select>`:

```tsx
<select
    value={selectedCity.name}
    onChange={(e) => {
        const city = CITIES.find(c => c.name === e.target.value)
        if (city) onCityChange(city)
    }}
>
    {CITIES.map(city => (
        <option key={city.name} value={city.name}>{city.name}</option>
    ))}
</select>
```

Но! Компонент `CitySelector` не знает про `CITIES` — этот массив живёт в `WeatherDashboard`. Как передать список городов в `CitySelector`? Подумай, что добавить в `Props`.

**5. Добавь `CitySelector` в `WeatherDashboard`**

Передай нужные пропсы и проверь, что при смене города прогноз обновляется.

### Что должно получиться

- Выпадающий список с тремя городами
- При выборе города — данные обновляются
- `CitySelector` — отдельный компонент с правильными пропсами

---

## Часть 3: Европа / Америка

Сейчас переключатель меняет только температуру (°C / °F). Расширь его до полноценного переключателя систем единиц.

| Система | Температура | Ветер |
|---------|------------|-------|
| Европа | °C | м/с |
| Америка | °F | миль/ч |

**Формулы:**
```
°F = °C * 9/5 + 32
миль/ч = м/с * 2.237
```

### Шаги

**1. В `WeatherDashboard` переименуй стейт**

```tsx
const [system, setSystem] = useState<"EU" | "US">("EU")
const toggleSystem = () => setSystem(system === "EU" ? "US" : "EU")
```

**2. Обнови кнопку**

```tsx
<button onClick={toggleSystem}>
    {system === "EU" ? "🌍 Европа" : "🌎 Америка"}
</button>
```

**3. Обнови `DayCard` — добавь ветер**

Сейчас `DayCard` показывает только температуру. Добавь вывод скорости ветра.

Для этого нужно:
- Добавить `system` в пропсы `DayCard`
- Пересчитывать `wind` перед отображением
- Показывать правильную единицу (`м/с` или `миль/ч`)

**4. Обнови `TempRange` — замени `unit: "C" | "F"` на `system: "EU" | "US"`**

Конвертация температуры уже там есть — просто поменяй условие.

### Что должно получиться

- Кнопка переключает систему единиц
- Температура и ветер меняются везде одновременно
- Правильные подписи: °C/°F, м/с/миль/ч

---

## Итог: что ты сделала в этой домашке

| Концепт | Где применила |
|---------|--------------|
| `useState` | стейт города, прогноза, системы единиц |
| `useEffect` с зависимостью | перезагрузка прогноза при смене города |
| `fetch` + `async/await` | получение данных с open-meteo API |
| Компонент с пропсами-значениями | `CitySelector` получает `selectedCity` и список городов |
| Компонент с пропсом-функцией | `CitySelector` получает `onCityChange` |
| Прокидывание стейта вниз | `system` уходит в `DayCard` и `TempRange` |
