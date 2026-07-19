# Recruitment Task - Contacts Management System

A web application for managing contacts with weather data integration based on contact locations.

The project consists of:

- **Backend** - Django REST Framework API
- **Frontend** - React + TypeScript + Tailwind CSS

---

# Requirements

Before running the project, make sure you have installed:

- Python >= 3.11
- Node.js >= 18
- npm

---

# Project Structure

```
Recruitment-task-SB/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3
│   ├── config/
│   └── api/
│
└── frontend/
    ├── package.json
    ├── src/
    └── vite.config.ts
    ...
```

---

# Backend

## 1. Navigate to the backend directory

```bash
cd backend
```

---

## 2. Create virtual environment

Linux / macOS:

```bash
python3 -m venv venv
```

Windows:

```bash
python -m venv venv
```

---

## 3. Activate virtual environment

Linux / macOS:

```bash
source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

---

## 4. Install dependencies

All required Python packages are listed in:

```
backend/requirements.txt
```

Install them using:

```bash
pip install -r requirements.txt
```

---

## 5. Run the backend server

```bash
python manage.py runserver
```

The API will be available at:

```
http://localhost:8000/api/
```

---

## (Optional) Database migration

The database included in the repository already contains:

- applied migrations,
- predefined contact statuses,
- initial data required for selecting a status while creating a contact.

If there are any database-related issues, from the `backend` directory run:

```bash
rm db.sqlite3
touch db.sqlite3

python manage.py migrate

python manage.py seed_statuses
```

---

# Frontend

## 1. Navigate to the frontend directory

Open another terminal:

```bash
cd frontend
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Run the application

```bash
npm run dev
```

The frontend will be available at:

```
http://localhost:5173/
```

---

# Features

## Contacts

The application allows users to:

- display a list of contacts,
- create contacts,
- edit contacts,
- delete contacts,
- filter contacts by:
  - first name,
  - last name,
  - email,
  - phone number,
  - city,
  - status,
- sort contacts.

---

# API Documentation

OpenAPI documentation is available at:

```
/api/docs/
```

Example:

```
http://localhost:8000/api/docs/
```

---

# Testing

The project contains unit tests that can be executed with:

```bash
python manage.py test
```

---

# Technologies

## Backend

- Python
- Django
- Django REST Framework
- drf-spectacular
- django-cors-headers
- django-environ

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
