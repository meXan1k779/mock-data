This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started


```bash
npm run dev     #To run the development server

npm run lint:fix    #To run lint and format code

npm run format    #To format code
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


src/
├── app/                   # Next.js App Router (страницы и лэйауты)
|
│
├── widgets/               # Самостоятельные составные блоки страниц
│
├── features/              # Бизнес-функциональность пользователя
│
│
├── shared/                # Переиспользуемые модули
    ├── ui/                # Базовые UI компоненты
    ├── lib/               # Утилиты и хелперы
    └── api/               # API клиенты и типы
