# Sokoni Backend API

A Node.js + Express.js based backend system designed for an African marketplace.
It provides secure authentication, user management, scalable product & order handling, and a chat-ready architecture, powered by Sequelize ORM for reliable database operations.

## 🛠 Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- Sequelize CLI
- JWT Authentication


## ✨ Features

- User Authentication (JWT based)
- Role-based access control
- Sequelize migrations & models
- Push Notifications using FCM
- API error handling & validation
- Secure environment configuration


## 🔐 Environment Variables

Create a `.env` file in root directory:


```env
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=******
DB_NAME=sokoni_market_place
JWT_SECRET=your_secret_key

```

## 🚀 Installation & Setup

### 1. Clone the repository

git clone https://github.com/ayush1910-maker/sokoni
cd sokoni

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a .env file in the root directory (refer to the Environment Variables section above).

### 4. Run the server
```bash
npm run test
```

## 🗄 Sequelize Migration Commands

### Generate migration
```
npx sequelize-cli migration:generate --name users-table
```

Migrate single migration (eg):-
```
npx sequelize-cli db:migrate --to 20251117121500-create-shout-out.cjs
```

Migrate all migrations :-
```
npx sequelize-cli db:migrate
```

## 📬 API Documentation

Swagger Collection:  
http://localhost:8080/api-docs/


## Figma Link
```
https://www.figma.com/design/5EkKhXQMssRXQBzlaI8OOm/Sokoni?node-id=0-1&p=f

```


## 🧠 Concepts Used

- MVC Architecture
- RESTful APIs
- Sequelize Associations
- Database migrations
- Authentication & Authorization

## 👤 Author

Ayush Porwal 
GitHub: https://github.com/ayush1910-maker  