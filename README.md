# 🚀 CommSphere - Community Discussion Forum with Real-Time Chat

![MERN](https://img.shields.io/badge/MERN-FullStack-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-success)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-RealTime-orange)
![JWT](https://img.shields.io/badge/JWT-Authentication-red)


## 🌐 Overview

CommSphere is a full-stack community discussion platform that combines structured discussion forums with real-time communication capabilities.

The application enables users to create discussion topics, participate in community conversations, post comments, and communicate instantly through discussion-specific live chat rooms powered by Socket.IO.

This project demonstrates modern full-stack development concepts including authentication, authorization, REST API development, database design, real-time communication, responsive UI development, and scalable application architecture.

---

## 🎯 Problem Statement

Traditional discussion forums provide persistent conversations but lack instant communication.

Real-time messaging platforms provide fast communication but lack structured discussion management.

CommSphere bridges this gap by combining:

* Discussion Threads
* Persistent Comments
* Real-Time Messaging
* Community Collaboration
* User Authentication
* Live Participation

into a single platform.

---

## ✨ Key Features

### 👤 Authentication & Security

* User Registration
* User Login
* JWT Authentication
* Password Hashing with bcrypt
* Protected Routes
* User Authorization

### 💬 Discussion Forum

* Create Discussions
* Edit Discussions
* Delete Discussions
* Browse Community Topics
* Discussion Detail Pages
* Search Discussions

### 📝 Comment System

* Add Comments
* View Comments
* Delete Comments
* Persistent Discussion History

### ⚡ Real-Time Chat

* Socket.IO Integration
* Discussion-Based Chat Rooms
* Instant Messaging
* Live Updates
* Active Room Communication

### 🔔 Notifications

* New Discussion Alerts
* New Comment Updates
* Real-Time Message Notifications

### 🎨 User Experience

* Responsive Design
* Modern Dashboard
* Clean UI Components
* Mobile Friendly Layout

---

## 🏗️ System Architecture

```text
Frontend (React.js)
        │
        ▼
 REST API Requests
        │
        ▼
Node.js + Express Server
        │
        ▼
MongoDB Database

Socket.IO
Client ◄────────► Server
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* JWT Authentication
* bcryptjs

### Database

* MongoDB
* Mongoose ODM

### Development Tools

* Git
* GitHub
* Postman
* VS Code

---

## 📂 Project Structure

```bash
Community-Discussion-Forum-RealTime-Chat/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── sockets/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── server.js
│   └── package.json
│
├── docs/
├── README.md
└── .gitignore
```

---

## 🔄 Application Workflow

```text
Register
    ↓
Login
    ↓
Dashboard
    ↓
Create Discussion
    ↓
Join Discussion
    ↓
Post Comments
    ↓
Join Chat Room
    ↓
Real-Time Messaging
    ↓
Notifications
```

---

## 🗄️ Database Collections

### Users

```javascript
{
 username,
 email,
 password,
 createdAt
}
```

### Discussions

```javascript
{
 title,
 description,
 createdBy,
 createdAt
}
```

### Comments

```javascript
{
 discussion,
 user,
 text,
 createdAt
}
```

### Messages

```javascript
{
 room,
 sender,
 text,
 createdAt
}
```

---

## 🔌 REST API Endpoints

### Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/auth/profile  |

### Discussions

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/discussions     |
| POST   | /api/discussions     |
| GET    | /api/discussions/:id |
| PUT    | /api/discussions/:id |
| DELETE | /api/discussions/:id |

### Comments

| Method | Endpoint                    |
| ------ | --------------------------- |
| POST   | /api/comments               |
| GET    | /api/comments/:discussionId |
| DELETE | /api/comments/:id           |

---

## ⚡ Socket.IO Events

### Client → Server

```javascript
joinRoom
sendMessage
typing
leaveRoom
```

### Server → Client

```javascript
receiveMessage
userTyping
roomUsers
messageHistory
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/Community-Discussion-Forum-RealTime-Chat.git
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## ⚙️ Environment Variables

### server/.env

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

## ▶️ Run Application

### Backend

```bash
npm run dev
```

Runs on:

```text
http://localhost:5000
```

### Frontend

```bash
npm run dev
```

Runs on:

```text
http://localhost:5173
```

---



---

## 🧪 Testing

### Functional Testing

* User Registration
* User Login
* JWT Validation
* Discussion CRUD
* Comment CRUD
* Real-Time Messaging
* Room Joining
* Notifications

### API Testing

* Postman
* Thunder Client

---

## 🎓 Learning Outcomes

Through this project, I learned:

* MERN Stack Development
* REST API Design
* JWT Authentication
* Password Security
* MongoDB Data Modeling
* Real-Time Communication
* Socket.IO Integration
* React State Management
* Frontend Routing
* Git & GitHub Workflow
* Full-Stack Project Architecture

---

## 🚀 Future Enhancements

* Private Messaging
* AI Content Moderation
* Discussion Categories
* Voice Channels
* Video Rooms
* File Sharing
* User Reputation System
* Discussion Voting
* Dark Mode
* Docker Deployment

---

## 👨‍💻 Author

**Sarthak Dhumal**

Full Stack Developer | MERN Stack Enthusiast | Software Engineering Student

GitHub: https://github.com/Saru2248

LinkedIn: https://www.linkedin.com/in/sarthak-dhumal-07555a211/

---

## ⭐ Support

If you found this project useful:

⭐ Star the repository

🍴 Fork the project

🛠️ Contribute to improvements

📢 Share with others

---

**Built with React, Node.js, Express, MongoDB, JWT, and Socket.IO**
