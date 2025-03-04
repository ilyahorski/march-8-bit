import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { SelectionProvider } from "../context/SelectionContext";
import { AudioProvider } from "../context/AudioContext";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata = {
  title: "8-Bit Женский День | Предсказания",
  description: "Интерактивная 8-битная открытка-предсказание к 8 марта в стиле пиксельного квеста",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${pixelFont.variable} antialiased text-[#ffffff] bg-[#0a0a0a] font-mono`} suppressHydrationWarning>
        <AudioProvider>
          <SelectionProvider>
            <div className="h-screen w-full max-w-screen mx-auto bg-[linear-gradient(to_right,rgba(255,105,180,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,105,180,0.1)_1px,transparent_1px)] bg-[length:3px_3px] sm:bg-[length:5px_5px] flex flex-col items-center justify-center overflow-auto">
              {children}
            </div>
          </SelectionProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
