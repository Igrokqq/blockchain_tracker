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

# Открываем порт для бэкенда
EXPOSE 4000

# Запускаем сервер NestJS
CMD ["pnpm", "start:prod"]
