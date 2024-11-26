# Используем официальный Node.js образ
FROM node:22

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только package.json и pnpm-lock.yaml для установки зависимостей
COPY package.json pnpm-lock.yaml ./

# Устанавливаем pnpm и зависимости
RUN npm install -g pnpm && pnpm install

# Копируем все остальные файлы
COPY . .

# Открываем порт для фронтенда
EXPOSE 3000

# Запускаем сервер Next.js
CMD ["pnpm", "dev"]
