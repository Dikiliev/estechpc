# Используем официальный образ Node.js для сборки фронтенда
FROM node:18 as build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install

# Копируем остальные файлы и запускаем сборку проекта
COPY . /app/
RUN npm run build

# Используем Nginx для обслуживания статических файлов
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем файл конфигурации Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт для доступа к приложению
EXPOSE 80
