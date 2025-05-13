# HireSkill Backend (NestJS + PostgreSQL)

This is the backend for **HireSkill**, a skill-sharing and task-based marketplace connecting users with individual or company providers. 
Built using 
[NestJS](https://nestjs.com/)
[TypeORM](https://typeorm.io/) 
[PostgreSQL](https://www.postgresql.org/)

It includes features such as:

- User & Provider Authentication
- Role-based Access (User / Provider Individual / Provider Company)
- Secure JWT authentication
- Task & Offer Lifecycle Management
- Skill & Category CRUD
- Audit trails with timestamped updates
- RESTful architecture with clear DTO-layer separation

---

## 🧱 Project Structure

```
src/
│
├── auth/                    # Auth logic, guards, roles, JWT, etc.
│   ├── dto/
│   ├── entities/
│   ├── guards/
│   ├── interfaces/
│   ├── decorators/
│   └── auth.service.ts
│
├── user/                    # User signup, profile logic
│
├── provider/                # Provider signup and logic
│
├── category/                # Categories (for skills and tasks)
│
├── skill/                   # Skills CRUD (provider-only)
│
├── task/                    # Task creation and lifecycle
│   ├── dto/
│   └── task.service.ts
│
├── common/                 # Shared decorators, pipes, DTOs
│
├── database/               # DB connection, seed, migrations
│
├── main.ts                 # Entry point
└── app.module.ts           # Root module
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone ''
cd hire-skill-be
npm install
```

### 2. Environment Setup

Create a `.env` file in the root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=hire_skill

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s
```

### 3. Start the App

```bash
npm run start:dev
```

NestJS will launch the app at: `http://localhost:3000`

---

## 📘 API Overview

| Module      | Routes                                           | Access                        |
|-------------|--------------------------------------------------|-------------------------------|
| **Auth**    | `/auth/login`, `/auth/change-password`          | Public / Authenticated        |
| **User**    | `/user/signup`, `/user/profile`                 | Public / Authenticated (user) |
| **Provider**| `/provider/signup`                              | Public                        |
| **Category**| `/category`                                     | Admin or Open CRUD            |
| **Skill**   | `/skill`                                        | Providers only                |
| **Task**    | `/task`, `/task/:id`, `/task/my`                | Users only                    |
| **Offers**  | `/task/:taskId/offer`, `/task/:taskId/progress` | Providers / Task creators     |

---

## 🛡️ Auth & Roles

- JWT-based authentication.
- Decorators: `@Roles(...)`, `@UseGuards(JwtAuthGuard, RolesGuard)`
- Roles: `user`, `provider_individual`, `provider_company`

---

## ✨ Features

- 🧑‍💼 User & Provider Signup with separate profiles
- 🔐 Auth with hashed passwords, salt & JWT
- 📄 Tasks with detailed statuses (created → completed)
- 💬 Provider Offers with messages and pricing
- 📈 Provider Task Progress Updates
- ✅ User Reviews and Task Completion Control
- 🧩 Modular Code Structure for scalability

---

## 🧰 Useful Scripts

| Script           | Description                         |
|------------------|-------------------------------------|
| `start:dev`      | Run in development with hot reload  |
| `build`          | Build the project                   |
| `format`         | Format code using Prettier          |

---

## 📦 Dependencies

- **NestJS**: Backend framework
- **TypeORM**: ORM for PostgreSQL
- **JWT**: Authentication token
- **Passport**: Strategy-based auth
- **Bcrypt**: Password hashing
- **Class-Validator** / **Class-Transformer**: Validation

---

## 📌 Notes

- Ensure PostgreSQL is running locally or use Docker.
- Use Swagger for API testing.
- Use Role Guards & JWT in all restricted routes.

---

## 🧑‍💻 Author

Created by Swathy Rajeev

---

## 📄 License

Feel free to use, contribute, and share your suggestions. Your feedback is always welcome. Happy coding!