import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Google Dinosaur 3D - Играть Онлайн | Игра Динозавр 3Д",
  description:
    "Играйте в Google Dinosaur 3D онлайн! Классическая игра динозавр в 3D формате. Прыгайте через препятствия, набирайте очки и побейте свой рекорд. Адаптивная версия для ПК и мобильных устройств.",
  keywords: "google dinosaur, динозавр игра, 3d игра, онлайн игра, браузерная игра, прыжки, препятствия, three.js",
  authors: [{ name: "Dinosaur Game Team" }],
  creator: "Dinosaur Game Team",
  publisher: "Dinosaur Game",
  robots: "index, follow",
  openGraph: {
    title: "Google Dinosaur 3D - Играть Онлайн",
    description: "Классическая игра динозавр в 3D формате. Прыгайте через препятствия и набирайте очки!",
    type: "website",
    locale: "ru_RU",
    siteName: "Google Dinosaur 3D",
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Dinosaur 3D - Играть Онлайн",
    description: "Классическая игра динозавр в 3D формате. Прыгайте через препятствия и набирайте очки!",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#87CEEB",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://your-domain.com",
    languages: {
      "ru-RU": "https://your-domain.com",
      "en-US": "https://your-domain.com/en",
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Game",
              name: "Google Dinosaur 3D - Играть Онлайн",
              description: "Классическая игра динозавр в 3D формате с Three.js",
              genre: "Аркада",
              gamePlatform: "Web Browser",
              operatingSystem: "Any",
              applicationCategory: "Game",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "RUB",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
