# Business Process Manager API

Backend API сервер для приложения Business Process Manager.

## Требования

- Python 3.8+
- PostgreSQL 12+
- Виртуальное окружение Python (рекомендуется)

## Установка

1. Клонировать репозиторий:
```bash
git clone <repository-url>
```

2. Перейти в директорию проекта:
```bash
cd backend-django
```

3. Создать и активировать виртуальное окружение:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

4. Установить зависимости:
```bash
pip install -r requirements.txt
```

5. Создать базу данных PostgreSQL:
```sql
CREATE DATABASE process_manager_db;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE process_manager_db TO postgres;
```

6. Выполнить миграции:
```bash
python manage.py makemigrations
python manage.py migrate
```

7. Создать суперпользователя:
```bash
python manage.py createsuperuser
```

## Запуск

### Режим разработки

```bash
python manage.py runserver
```

После запуска API сервер будет доступен по адресу: http://127.0.0.1:8000/

### Тестирование API

Для доступа к административной панели Django:
http://127.0.0.1:8000/admin/

Для доступа к API документации:
http://127.0.0.1:8000/api/

## Структура проекта

- `process_manager/` - Django проект
  - `settings.py` - настройки проекта
  - `urls.py` - основные маршруты URL
- `process_manager_app/` - Django приложение
  - `models.py` - модели данных
  - `serializers.py` - сериализаторы REST API
  - `views.py` - представления REST API
  - `urls.py` - маршруты URL API

## API Endpoints

- `/api/` - корень API
- `/api/auth/` - аутентификация
  - `/api/auth/login/` - получение JWT токена
  - `/api/auth/refresh/` - обновление JWT токена
  - `/api/auth/register/` - регистрация пользователя
- `/api/employees/` - сотрудники
- `/api/departments/` - отделы
- `/api/processes/` - бизнес-процессы
- `/api/tasks/` - задачи

## Лицензия

MIT 