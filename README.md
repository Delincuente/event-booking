# EventHub - Event Booking System

EventHub is a full-stack MERN application for managing and booking events. Built with Node.js, React, and MySQL, it features a secure authentication system, event management, and a seamless booking experience.

## 🚀 Technologies Used

### Frontend
- **React** (Vite)
- **React Router Dom** (Navigation)
- **Axios** (API Calls)
- **Lucide React** (Icons)
- **Vanilla CSS** (Custom Styling)

### Backend
- **Node.js & Express**
- **Sequelize ORM** (Database Management)
- **MySQL** (Relational Database)
- **JWT & BcryptJS** (Authentication & Security)

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [XAMPP](https://www.apachefriends.org/index.html) or a local [MySQL](https://dev.mysql.com/downloads/installer/) server
- [Git](https://git-scm.com/)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd event-booking-AI
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `server` directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=event_booking
JWT_SECRET=your_super_secret_key
```

### 4. Database Setup
Ensure your MySQL server (XAMPP) is running. Then, run the following commands in the `server` directory:

1. **Create the Database:**
   ```bash
   npx sequelize-cli db:create
   ```
2. **Run Migrations (Create Tables):**
   ```bash
   npx sequelize-cli db:migrate
   ```

### 5. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

---

## 🏃 Running the Project

### Start the Backend
From the `server` directory:
```bash
npm run dev
```
The API will be available at `http://localhost:5000`.

### Start the Frontend
From the `client` directory:
```bash
npm run dev
```
The application will open at `http://localhost:3000`.

---

## 📂 Project Structure
- **/client**: React frontend (Vite)
- **/server**: Node.js/Express backend
- **/server/models**: Sequelize model definitions
- **/server/migrations**: Database schema version control
- **/server/routes**: API endpoint definitions

---

## 🔐 Admin Credentials
*(Optional: If you have seeded an admin user, list the credentials here or explain how to create one).*
