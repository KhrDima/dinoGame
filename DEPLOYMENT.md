# 🚀 Руководство по деплою Google Dinosaur 3D

## Быстрый деплой на Vercel (рекомендуется)

### 1. Через Vercel CLI
\`\`\`bash
# Установка Vercel CLI
npm i -g vercel

# Деплой проекта
vercel --prod

# Следуйте инструкциям в терминале
\`\`\`

### 2. Через GitHub интеграцию
1. Загрузите код в GitHub репозиторий
2. Перейдите на [vercel.com](https://vercel.com)
3. Нажмите "New Project"
4. Выберите ваш GitHub репозиторий
5. Нажмите "Deploy"

## Деплой на Netlify

### 1. Через Netlify CLI
\`\`\`bash
# Установка Netlify CLI
npm install -g netlify-cli

# Сборка проекта
npm run build

# Деплой
netlify deploy --prod --dir=.next
\`\`\`

### 2. Через веб-интерфейс
1. Соберите проект: `npm run build`
2. Перейдите на [netlify.com](https://netlify.com)
3. Перетащите папку `.next` в область деплоя

## Деплой на GitHub Pages

\`\`\`bash
# Экспорт статических файлов
npm run export

# Загрузите содержимое папки `out` в ветку gh-pages
\`\`\`

## Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

\`\`\`env
# URL вашего сайта
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Google Analytics (опционально)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Yandex Metrica (опционально)  
NEXT_PUBLIC_YANDEX_ID=XXXXXXXX
\`\`\`

## Настройка домена

### Vercel
1. В панели Vercel перейдите в Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS записи согласно инструкциям

### Netlify
1. В панели Netlify перейдите в Site settings → Domain management
2. Добавьте custom domain
3. Настройте DNS записи

## Оптимизация производительности

### 1. Включите сжатие
Добавьте в `next.config.mjs`:

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig
\`\`\`

### 2. Настройте кэширование
Для статических ресурсов добавьте заголовки кэширования:

\`\`\`javascript
// В next.config.mjs
async headers() {
  return [
    {
      source: '/the_google_dinosaur_3d.glb',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ]
}
\`\`\`

## Мониторинг и аналитика

### Google Analytics
1. Создайте аккаунт Google Analytics
2. Получите Measurement ID
3. Добавьте в `.env.local`: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`

### Vercel Analytics
\`\`\`bash
npm install @vercel/analytics

# Добавьте в app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

## Проверка деплоя

После деплоя проверьте:

- ✅ Игра загружается и работает
- ✅ 3D модель динозавра отображается
- ✅ Мобильные элементы управления работают
- ✅ Сохранение рекордов функционирует
- ✅ SEO метатеги присутствуют
- ✅ PWA манифест доступен
- ✅ Сайт работает на мобильных устройствах

## Устранение проблем

### Проблема: 3D модель не загружается
**Решение**: Убедитесь, что файл `the_google_dinosaur_3d.glb` находится в папке `public/`

### Проблема: Игра не работает на мобильных
**Решение**: Проверьте, что touch события правильно обрабатываются

### Проблема: Низкая производительность
**Решение**: 
- Уменьшите качество теней в Three.js
- Оптимизируйте 3D модель
- Включите сжатие ресурсов

## Поддержка

Если возникли проблемы с деплоем:
1. Проверьте логи сборки
2. Убедитесь в корректности зависимостей
3. Проверьте переменные окружения
4. Обратитесь к документации платформы деплоя

---

**Удачного деплоя! 🦕🚀**
