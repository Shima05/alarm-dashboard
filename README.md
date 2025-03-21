# Alarm Management System

## Overview

The **Alarm Management System** is a full-stack web application that allows sensors to send alarms and visualizations, enabling users to view and filter alarms through an intuitive interface. The system includes:

- **REST API** built with **Express.js**
- **React** frontend for user interaction
- **SQLite** for data persistence
- **JWT-based authentication** for secure access
- **Unit and End-to-End (E2E) tests** to ensure reliability

## Features

✅ Sensors can send alarms (UUID, timestamp, type) via API  
✅ Sensors can upload JPEG visualizations for alarms  
✅ Users can list, filter, and paginate alarms  
✅ Users can view all visualizations associated with an alarm  
✅ Secure authentication and authorization  
✅ OpenAPI specification included for API documentation  
✅ Full testing coverage using unit and E2E tests

## Technologies Used

### Backend

- **Node.js + Express.js** (REST API)
- **SQLite** (Database)
- **JWT (JSON Web Token)** (Authentication)
- **Jest + Supertest** (Unit Testing)
- **OpenAPI Specification** (API Documentation)

### Frontend

- **React.js** (Single Page Application Framework)
- **React Router** (Client-side Routing)
- **Axios** (HTTP Requests)
- **React Testing Library + Jest** (Testing Framework)

### DevOps & CI/CD

- **GitHub Actions** (CI/CD pipeline)

---

## Setup

### Backend Setup

> **NOTE:** You need to create a `.env` file in the backend folder from the `.env.template` file and modify its contents based on your configurations.

```sh
cd backend
npm install
npm run start
```

By default, the backend runs on **http://localhost:3000**.

#### Running Tests (Backend)

```sh
npm run test
```

### Frontend Setup

```sh
cd frontend
npm install
npm run start
```

By default, the frontend runs on **http://localhost:5173**.

#### Running Tests (Frontend)

```sh
npm run test
```

### Running End-to-End Tests (Cypress)

```sh
npm run e2e
```

---

## API Endpoints

| Method | Endpoint                         | Description                     |
| ------ | -------------------------------- | ------------------------------- |
| `POST` | `/api/auth/login`                | Authenticate user and get JWT   |
| `GET`  | `/api/alarms`                    | List alarms with filtering      |
| `POST` | `/api/alarms`                    | Create a new alarm              |
| `POST` | `/api/alarms/:id/visualizations` | Upload JPEG visualization       |
| `GET`  | `/api/alarms/:id/visualizations` | Get visualizations for an alarm |

For full API documentation, check the **OpenAPI Spec** in `backend/docs/openapi.yaml`.

---

## Folder Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── tests/
│   │   ├── app.js
│   │   ├── db.js
│   ├── package.json
│   ├── openapi.yaml
│   ├── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── tests/
│   │   ├── App.js
│   │   ├── index.js
│   ├── package.json
│   ├── README.md
│
├── cypress/
│   ├── integration/
│   ├── support/
│
├── docker-compose.yml (Optional)
├── README.md
```

---

## Authentication & Security

- **JWT Authentication**: Users must log in to get a JWT token and send it in headers (`Authorization: Bearer <token>`) for protected routes.
- **CORS & Security Headers**: Configured using `helmet` and `cors`.
- **Password Hashing**: Stored using `bcrypt`.

---

## Testing Strategy

### Backend Tests (Jest + Supertest)

- Unit tests for controllers and database interactions
- API tests for endpoints (success & failure cases)

### Frontend Tests (React Testing Library + Jest)

- Component rendering tests
- API mock tests
- Error handling

### End-to-End Tests (Cypress)

- Full user flow: login, view alarms, filter alarms, view visualizations
- Authentication and authorization tests

---

## Contact

If you have any questions or need support, feel free to reach out to me at **shima.bayatifar@gmail.com**. I'm always happy to help!
