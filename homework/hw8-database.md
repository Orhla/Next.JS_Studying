# Домашнее задание 8: База данных и ORM

## Тема урока

ORM, Prisma, PostgreSQL. Форма пишет в базу, страница читает из базы.

---

## Контекст

На прошлой домашке форма фидбэка отправляла письмо. Теперь мы заменяем это на запись в базу данных — и добавляем отображение последних отзывов на странице города. Это базовый CR без U и D: Create и Read.

---

## Часть 0: Установка Docker

Docker — это программа которая запускает изолированные контейнеры. Мы используем его чтобы поднять PostgreSQL локально без ручной установки.

### Windows

1. Скачай и установи **Docker Desktop**: https://www.docker.com/products/docker-desktop/
2. При установке выбери **WSL 2** (не Hyper-V) — это обязательно для Windows 10/11
3. После установки Docker Desktop запустится автоматически. В трее появится иконка кита.
4. Открой терминал (PowerShell или Windows Terminal) и проверь:

```bash
docker --version
docker compose version
```

Если оба выдали версии — Docker работает.

> Если при запуске Docker Desktop пишет "WSL 2 installation is incomplete" — скачай и установи обновление ядра Linux по ссылке из сообщения об ошибке, это стандартная процедура на Windows.

---

## Часть 1: Поднимаем базу данных

Создай файл `docker-compose.yml` в корне проекта:

```yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: weather_app
    ports:
      - "5432:5432"
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
```

Запусти контейнер:

```bash
docker compose up -d
```

Флаг `-d` запускает в фоне. Чтобы проверить что база работает:

```bash
docker compose ps
```

Должна быть строчка с `db` и статусом `running`.

> `postgres-data/` — папка куда Docker сохраняет данные базы. Она появится в корне проекта. Добавь её в `.gitignore` — там лежат бинарные данные PostgreSQL, им не место в репозитории.

---

## Часть 2: Устанавливаем Prisma

```bash
npm install prisma @prisma/client @prisma/adapter-pg
npx prisma init
```

Команда `prisma init` создаст два файла:
- `prisma/schema.prisma` — схема базы данных
- `.env` — файл с переменными окружения (если не было)

### Настрой `.env`

Открой `.env` и замени строку `DATABASE_URL` на:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/weather_app
```

> Кавычки не нужны — просто значение без кавычек.

Убедись что `.env` есть в `.gitignore`. Туда попадает пароль от базы — он не должен уходить в репозиторий.

---

## Часть 3: Схема базы данных

Открой `prisma/schema.prisma` и замени содержимое на:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Feedback {
  id          Int      @id @default(autoincrement())
  name        String
  temperature Int
  weather     String
  createdAt   DateTime @default(now())
}
```

Создай таблицу в базе и сгенерируй клиент:

```bash
npx prisma db push
npx prisma generate
```

`db push` — создаёт таблицы по схеме. Для разработки это проще чем миграции (о них поговорим позже).  
`prisma generate` — генерирует TypeScript-клиент в `src/generated/prisma/`.

---

## Часть 4: Prisma клиент — `lib/prisma.ts`

Создай файл `src/lib/prisma.ts`:

```ts
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })

export const prisma =
    globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
```

Почему такая конструкция с `globalThis`? В режиме разработки Next.js перезагружает модули при каждом изменении файла. Без этого трюка каждая перезагрузка создавала бы новое соединение с базой — и за несколько часов работы их накопились бы сотни.

---

## Часть 5: Проверь Prisma Studio

```bash
npx prisma studio
```

Открой `http://localhost:5555`. Ты увидишь таблицу `Feedback` — пока пустую. Можно добавить строку вручную и убедиться что база работает.

---

## Часть 6: Server Action — пишем в базу

Замени содержимое `src/app/actions/feedback.ts`. Теперь server action должен валидировать данные И писать в базу — всё в одном месте:

```ts
"use server"

import { prisma } from '@/lib/prisma'

type ActionResult =
    | { success: true }
    | { success: false; error: string }

export async function submitFeedback(data: {
    name: string
    temperature: number
    weather: string
}): Promise<ActionResult> {
    try {
        if (data.name.length < 2) {
            return { success: false, error: 'Имя слишком короткое' }
        }

        if (typeof data.temperature !== 'number' || data.temperature < -50 || data.temperature > 50) {
            return { success: false, error: 'Температура должна быть числом от -50 до 50' }
        }

        const validWeather = ['sunny', 'cloudy', 'rainy']
        if (!validWeather.includes(data.weather)) {
            return { success: false, error: 'Некорректный тип погоды' }
        }

        await prisma.feedback.create({
            data: {
                name: data.name,
                temperature: data.temperature,
                weather: data.weather,
            }
        })

        return { success: true }

    } catch {
        return { success: false, error: 'Ошибка сервера' }
    }
}
```

---

## Часть 7: Обновляем форму — `FeedbackForm.tsx`

Форма теперь вызывает `submitFeedback` вместо двух отдельных функций. Убери импорт `sendFeedbackEmail` — он больше не нужен. Логика в форме должна упроститься:

```ts
const result = await submitFeedback({ name, temperature: Number(temperature), weather })
```

> Обрати внимание: `temperature` в форме хранится как строка (`useState('')`), но в базу пишется как число. Конвертация `Number(temperature)` происходит один раз — при отправке.

---

## Часть 8: Читаем из базы — компонент `FeedbackList`

Создай `src/components/feedback/FeedbackList.tsx`.

Это **серверный компонент** — он сам запрашивает данные из базы, не нужно никаких `useState` и `useEffect`.

```tsx
import { prisma } from '@/lib/prisma'

const weatherLabels: Record<string, string> = {
    sunny: 'Солнечно',
    cloudy: 'Облачно',
    rainy: 'Дождь',
}

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
                    {fb.temperature}°C, {weatherLabels[fb.weather] ?? fb.weather}
                </li>
            ))}
        </ul>
    )
}
```

`take: 5` — берём только 5 последних записей.  
`orderBy: { createdAt: 'desc' }` — новые сверху.

---

## Часть 9: Добавляем на страницу города

Обнови `src/app/city/[cityID]/page.tsx` — добавь `FeedbackList` под формой:

```tsx
import FeedbackList from '@/components/feedback/FeedbackList'

// внутри return:
<div className="flex flex-col gap-4">
    <p className="font-semibold">Данные неточные? Сообщи нам!</p>
    <FeedbackForm />
    <p className="font-semibold mt-4">Последние отзывы</p>
    <FeedbackList />
</div>
```

---

## Что должно получиться

1. Пользователь открывает страницу города
2. Видит форму и под ней — последние 5 отзывов из базы
3. Заполняет форму, отправляет — данные записываются в PostgreSQL
4. Страница обновляется — новый отзыв появляется в списке
5. Prisma Studio показывает все записи в таблице

---

## Вопросы для размышления

- Почему `FeedbackList` — серверный компонент, а `FeedbackForm` — клиентский?
- Что произойдёт если остановить Docker пока приложение работает?
- `take: 5` возвращает последние 5 записей. Как вернуть все записи? Как вернуть записи только за сегодня?
- Почему мы не добавили `revalidatePath` после записи в базу — и заметишь ли ты это в поведении приложения?
