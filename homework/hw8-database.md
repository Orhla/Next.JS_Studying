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

`docker-compose.yml` мы разбирали на уроке — он уже есть в репозитории. Тебе нужно только запустить контейнер на своей машине:

```bash
docker compose up -d
```

Флаг `-d` запускает в фоне. Проверь в Docker Desktop — контейнер `db` должен быть зелёным.

> `postgres-data/` — папка куда Docker сохраняет данные базы. Она появится в корне проекта.

---

## Часть 2: Устанавливаем Prisma

На уроке мы это делали вместе — повтори на своей машине:

```bash
npx prisma init
```

`prisma init` создаст `prisma/schema.prisma` и добавит `DATABASE_URL` в `.env`.

### Настрой `.env`

Открой `.env` и убедись что `DATABASE_URL` выглядит вот так — **без кавычек**:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/weather_app
```

Убедись что `.env` есть в `.gitignore`. Туда попадает пароль от базы — он не должен уходить в репозиторий.

---

## Часть 3: Схема базы данных

`prisma/schema.prisma` уже создан на уроке, ничего делать не нужно. Для справки — он выглядит так:

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

---

## Часть 4: Prisma клиент — `lib/prisma.ts`

Этот файл мы писали на уроке. Убедись что `src/lib/prisma.ts` выглядит вот так:

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

---

## Часть 5: Запускаем и проверяем

Запусти по порядку — это мы делали на уроке:

```bash
npm run prisma:push
```
Создаёт таблицы в базе по схеме. Для разработки это проще чем миграции — о них поговорим позже.

```bash
npm run prisma:generate
```
Генерирует TypeScript-клиент в `src/generated/prisma/`. Запускай каждый раз после изменения схемы.

```bash
npm run dev
```

### ✅ Контрольная точка

Прежде чем писать новый код — убедись что всё работает:

1. Открой страницу любого города
2. Заполни форму фидбэка и отправь
3. Запусти `npm run prisma:studio` и открой `http://localhost:5555`
4. В таблице `Feedback` должна появиться запись

Если запись есть — установка прошла успешно. Дальше — новый код.

---

## Часть 6: Email-уведомление для администратора

`lib/email.ts` никуда не девается — но его роль меняется. Раньше письмо было единственным способом сохранить фидбэк. Теперь источник правды — база данных, а письмо стало уведомлением: "внимание, пришёл новый фидбэк".

Обнови `src/app/actions/feedback.ts` — после записи в базу вызывай отправку письма:

```ts
await prisma.feedback.create({ ... })
await sendFeedbackEmail({ name: data.name, temperature: data.temperature, weather: data.weather })
```

**Важно:** если письмо не отправилось — это не повод возвращать ошибку пользователю. Его фидбэк уже сохранён в базе. Оберни вызов email отдельно:

```ts
await prisma.feedback.create({ data: { ... } })

try {
    await sendFeedbackEmail({ ... })
} catch {
    console.error('Не удалось отправить уведомление на почту')
}

return { success: true }
```

**Слои выглядят так:**

```
lib/email.ts          — отправляет письмо. Не знает о форме, не знает о базе
lib/prisma.ts         — клиент базы данных. Не знает об email
actions/feedback.ts   — координирует: валидирует → пишет в базу → уведомляет
FeedbackForm.tsx      — вызывает только server action. Больше ничего
```

`FeedbackForm` не должна знать ни про базу, ни про email — это детали реализации. Она просто отправляет данные и получает `{ success: true }` или ошибку.

---

## Часть 7: Читаем из базы — компонент `FeedbackList`

Создай `src/components/feedback/FeedbackList.tsx` — этого файла у тебя ещё нет.

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

## Часть 8: Добавляем на страницу города

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
