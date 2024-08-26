# Используем базовый образ с Python 3.10
FROM python:3.10-slim

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файлы requirements и устанавливаем зависимости
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект в контейнер
COPY . /app/

# Настраиваем переменные окружения
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings

# Выполняем миграции и собираем статику
RUN python manage.py migrate --noinput
RUN python manage.py collectstatic --noinput

# Открываем порт для доступа к Django приложению
EXPOSE 8000

# Команда для запуска Django сервера
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
