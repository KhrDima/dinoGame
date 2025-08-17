# 🦕 Google Dinosaur 3D - Next.js Game

Профессиональная 3D реализация классической игры Chrome Dinosaur с использованием Three.js, Next.js и TypeScript.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)

## 🎮 Особенности игры

- **3D графика** - полноценная 3D сцена с освещением и тенями
- **GLB модель динозавра** - использование предоставленной 3D модели
- **Физика прыжков** - реалистичная гравитация и движение
- **Препятствия** - кактусы и летающие птицы
- **Звуковые эффекты** - Web Audio API для звуков
- **Адаптивность** - полная поддержка мобильных устройств
- **Сохранение рекордов** - LocalStorage для лучших результатов
- **SEO оптимизация** - метатеги и структурированные данные

## 🚀 Быстрый старт

### Установка

\`\`\`bash
# Клонирование репозитория
git clone <repository-url>
cd google-dinosaur-3d

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Открыть http://localhost:3000
\`\`\`

### Сборка для продакшена

\`\`\`bash
# Сборка приложения
npm run build

# Запуск продакшен сервера
npm start
\`\`\`

## 🛠 Технологии

- **Next.js 15** - React фреймворк с App Router
- **Three.js** - 3D графическая библиотека
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - utility-first CSS фреймворк
- **Radix UI** - компоненты интерфейса
- **Web Audio API** - звуковые эффекты

## 🎯 Управление

### Клавиатура:
- **ПРОБЕЛ** или **↑** - прыжок
- **↓** - пригибание

### Мобильные устройства:
- **Кнопка "ПРЫЖОК"** - прыжок динозавра
- **Кнопка "ПРИГНУТЬСЯ"** - пригибание под препятствия

## 🌐 Деплой

### Vercel (рекомендуется)
\`\`\`bash
npm i -g vercel
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
npm run build
# Загрузить папку .next
\`\`\`

### Другие платформы
\`\`\`bash
npm run export
# Загрузить папку out
\`\`\`

## 📱 Мобильная адаптивность

- Автоматическое определение мобильных устройств
- Сенсорные кнопки управления
- Оптимизированный интерфейс для касаний
- Поддержка альбомной ориентации

## 🔧 Настройка

### Переменные окружения
Создайте `.env.local`:

\`\`\`env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
\`\`\`

### Кастомизация игры
В `components/DinosaurGame.tsx`:

\`\`\`typescript
// Настройка физики
const gravity = 0.02
const jumpPower = 0.4
const gameSpeed = 0.1

// Частота препятствий
const obstacleSpawnRate = 0.01
\`\`\`

## 📊 SEO оптимизация

- ✅ Meta теги для социальных сетей
- ✅ Structured Data (Schema.org)
- ✅ Open Graph разметка
- ✅ Twitter Cards
- ✅ PWA манифест
- ✅ Мобильная оптимизация

## 🎨 3D Модель

Игра использует предоставленную GLB модель динозавра:
- Автоматическая загрузка 3D модели
- Поддержка анимаций (если есть в модели)
- Fallback на геометрический динозавр
- Масштабирование и позиционирование

## 📈 Производительность

- **60 FPS** - плавная анимация
- **Оптимизированный рендеринг** - Three.js оптимизации
- **Lazy Loading** - динамическая загрузка компонентов
- **Bundle Size** - оптимизированный размер

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Commit изменения
4. Push в branch
5. Откройте Pull Request

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

## 🎯 Roadmap

- [ ] Мультиплеер режим
- [ ] Дополнительные 3D модели
- [ ] Система достижений
- [ ] Кастомные уровни
- [ ] VR поддержка

---

**Играйте и наслаждайтесь 3D динозавром! 🦕🎮**
