# Business Process Manager

Полнофункциональный менеджер бизнес-процессов с возможностью создания, редактирования и отслеживания проектов.

## Структура проекта

- `front-react-project/` - Frontend на React/Vite
- `backend-django/` - Backend API на Django REST Framework
- `figma_images/` - Дизайн макеты из Figma

## Требования

- Python 3.8+ и pip
- Node.js 14+ и npm
- PostgreSQL 12+
- Windows

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone [URL_РЕПОЗИТОРИЯ]
cd ProcessManager
```

### 2. Настройка и запуск бэкенда

```bash
# Создание и активация виртуального окружения
cd backend-django
python -m venv venv

# Активация в Windows
venv\Scripts\activate

# Установка зависимостей
pip install -r requirements.txt

# Создайте базу данных PostgreSQL с именем process_manager_db
# и настройте доступ в backend-django/process_manager/settings.py

# Применение миграций
python manage.py migrate

# Создание суперпользователя
python manage.py createsuperuser

# Запуск сервера
python manage.py runserver
```

Бэкенд будет доступен по адресу http://localhost:8000/

### 3. Настройка и запуск фронтенда

```bash
cd front-react-project
npm install
npm run dev
```

Фронтенд будет доступен по адресу http://localhost:5173/

### 4. Быстрый старт (Windows)

Для быстрого запуска обоих серверов можно использовать прилагаемый скрипт:

```bash
start-dev.cmd
```

## Аутентификация

Для тестирования можно использовать:

- Логин: admin
- Пароль: admin

Или создайте своего пользователя через страницу регистрации.

## Основные возможности

- Управление бизнес-процессами
- Создание и редактирование процессов с визуальным конструктором
- Управление задачами и их статусами
- Назначение задач сотрудникам
- Отслеживание прогресса выполнения

## Разработчики

- Ваше имя и контакты

## Лицензия

MIT
