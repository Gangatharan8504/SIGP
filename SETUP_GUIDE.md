# 🚀 SGIP - Developer Setup & Handover Guide

Welcome to the **Student Growth Intelligence & Placement Platform (SGIP)**! Follow this guide to set up the project locally on your machine and continue development.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: `v18.x` or `v20.x` (Recommended: `v20 LTS`)
- **npm**: `v9.x` or `v10.x`
- **Git**: Installed and configured
- **MongoDB**: A free **MongoDB Atlas cluster URI** or local MongoDB instance (`mongodb://localhost:27017/sgip`)
- **Groq API Key** (Optional but recommended for AI features): Get a free key at [console.groq.com](https://console.groq.com)

---

## 📂 Project Architecture

```text
SGIP/
├── backend/
│   ├── src/
│   │   ├── config/        # Database (MongoDB) & AI (Groq) configurations
│   │   ├── controllers/   # Auth, Student, Assessment, Roadmap, Resume, Admin controllers
│   │   ├── middleware/    # JWT Auth & Error Handling
│   │   ├── models/        # Mongoose Data Models
│   │   ├── routes/        # Express API endpoints (/api/auth, /api/student, etc.)
│   │   ├── seeds/         # Default demo seed data & baseline assessments
│   │   ├── services/      # AI Services, Compiler Execution, Email SMTP
│   │   ├── app.js         # Express App setup & CORS
│   │   └── server.js      # Main Server entry point (Port 5000)
│   └── .env.example       # Backend environment template
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios HTTP client & API service endpoints
│   │   ├── components/    # Reusable UI, Dashboard, Placement Roadmap & Resume Builder
│   │   │   ├── pages/     # Student, Faculty & Coordinator Pages
│   │   │   ├── roadmap/   # Stage 1: Aptitude & Stage 2: LeetCode/DSA modules
│   │   │   └── resume/    # GoResume-style ATS Resume Builder & Templates
│   │   ├── utils/         # Curated Aptitude & DSA datasets
│   │   ├── App.jsx        # React Router routes
│   │   └── main.jsx       # React DOM entry
│   ├── vite.config.js     # Vite configuration with /api reverse proxy
│   └── .env.example       # Frontend environment template
├── package.json           # Root package scripts & backend dependencies
└── SETUP_GUIDE.md         # This setup guide
```

---

## ⚡ Step-by-Step Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Gangatharan8504/SIGP.git
cd SIGP
```

---

### 2. Configure Environment Variables

#### Backend (`backend/.env`):
Create a `.env` file in the `backend/` folder (or copy `backend/.env.example`):
```bash
# Inside backend/.env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sgip?retryWrites=true&w=majority
JWT_SECRET=sgip_super_secret_jwt_key_2026
GROQ_API_KEY=gsk_your_groq_key_here
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`):
In local development, the frontend uses Vite's built-in proxy (`/api` &rarr; `http://localhost:5000`), so you can leave `frontend/.env` blank or set:
```bash
# Inside frontend/.env
VITE_API_URL=
```

---

### 3. Install Dependencies

Install root (backend) dependencies and frontend dependencies:
```bash
# 1. Install Backend Dependencies
npm install

# 2. Install Frontend Dependencies
npm install --prefix frontend
```

---

### 4. Start the Application

You can run both the Backend and Frontend concurrently in two separate terminal windows:

#### Terminal 1: Start Backend Server
```bash
node backend/src/server.js
# Or: npm start
```
> ✅ Server will connect to MongoDB, automatically seed initial baseline assessments and users, and listen on **`http://localhost:5000`**.

#### Terminal 2: Start Frontend Development Server
```bash
npm run dev --prefix frontend
```
> 🌐 Frontend will start and be accessible at **`http://localhost:5173`**.

---

## 🔑 Default Login Accounts (Pre-Seeded)

The backend auto-seeds the following test accounts on first launch:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@sgip.edu` | `password123` |
| **Faculty** | `faculty@sgip.edu` | `password123` |
| **Placement Coordinator / Admin** | `admin@sgip.edu` | `password123` |

*You can also register a new student account directly from the `/register` page.*

---

## 🌟 Key Features & Routes

- **Dashboard**: `http://localhost:5173/dashboard`
- **Stage 1: Aptitude Roadmap (36 Topics)**: `http://localhost:5173/learning-plan`
- **Stage 2: LeetCode & DSA Problem Solving**: `http://localhost:5173/learning-plan`
- **Online Coding Compiler**: `http://localhost:5173/practice`
- **ATS Resume Builder (GoResume Studio)**: `http://localhost:5173/resume-analyzer`
- **Mock Assessments & Secure Exam Mode**: `http://localhost:5173/assessments`

---

## 🚀 Building for Production

To build the client application bundle:
```bash
npm run build --prefix frontend
```
The optimized production files will be output to `frontend/dist/`.
