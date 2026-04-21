# SGMS Elite — SIES GST Student Grievance Management System

## ⚡ Quick Start (5 minutes)

### Prerequisites
- Node.js v18+ installed
- MongoDB running locally on port 27017 (or MongoDB Atlas URI)
- VS Code (recommended)

---

## 📁 Project Structure

```
sgms/
├── backend/               ← Node.js / Express API
│   ├── config/db.js       ← MongoDB connection
│   ├── models/
│   │   ├── Student.js     ← Student schema
│   │   ├── Admin.js       ← Admin / Faculty schema
│   │   └── Complaint.js   ← Grievance schema
│   ├── middleware/auth.js  ← JWT authentication
│   ├── routes/
│   │   ├── studentAuth.js ← POST /api/auth/register, /api/auth/login
│   │   ├── adminAuth.js   ← POST /api/admin/register, /api/admin/login
│   │   └── complaints.js  ← GET/POST/PATCH/DELETE /api/complaints
│   ├── server.js          ← Main entry point
│   ├── .env               ← Environment variables
│   └── package.json
│
└── frontend/              ← Pure HTML/CSS/JS pages
    ├── index.html         ← 🏠 Home / Landing page (always clears sessions)
    ├── student-login.html ← Student Login + Register
    ├── login.html         ← Admin / Faculty Login + Register
    ├── student-hub.html   ← Student dashboard (auth guarded)
    ├── file-complaint.html← File a complaint (auth guarded)
    ├── analytics.html     ← Student's own complaint history
    ├── admindashboard.html← Admin view — all complaints + update status
    ├── staffworkflow.html ← Faculty node — queue + update
    ├── profile.html       ← Student profile page
    ├── support.html       ← FAQ page
    ├── governance.html    ← Governance info
    ├── guidelines.html    ← Submission guidelines
    └── privacy.html       ← Privacy policy
```

---

## 🚀 Step-by-Step Setup

### 1. Start MongoDB
Make sure MongoDB is running:
```bash
# macOS / Linux
mongod

# Windows (if installed as service)
net start MongoDB
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment
The `.env` file is already included with these defaults:
```
PORT=8080
MONGO_URI=mongodb://localhost:27017/sgms_elite
JWT_SECRET=sgms_elite_super_secret_key_siesgst_2026
ADMIN_SECRET=SIESGST_ADMIN_2026
```
> **MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string.

### 4. Start the Backend
```bash
npm run dev     # Development (auto-restarts with nodemon)
# or
npm start       # Production
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 SGMS Elite Server started on port 8080
📡 API Base: http://localhost:8080/api
🏫 Institution: SIES GST
```

### 5. Open the Frontend
Open `frontend/index.html` in your browser.
> Use **Live Server** extension in VS Code for best experience.

---

## 🔐 Authentication Flow

### Students
| Action | Page | API |
|--------|------|-----|
| Register | `student-login.html` → Register tab | `POST /api/auth/register` |
| Login | `student-login.html` → Login tab | `POST /api/auth/login` |
| File complaint | `file-complaint.html` | `POST /api/complaints` |
| View own complaints | `analytics.html` | `GET /api/complaints` |

### Admin / Faculty
| Action | Page | API |
|--------|------|-----|
| Register (Faculty) | `login.html` → Faculty Node → New Account | `POST /api/admin/register` |
| Register (Super Admin) | `login.html` → Super Admin → New Account | `POST /api/admin/register` |
| Login | `login.html` | `POST /api/admin/login` |
| View all complaints | `admindashboard.html` | `GET /api/complaints` |
| Update complaint | `admindashboard.html` → Update button | `PATCH /api/complaints/:id/status` |

> **Admin Registration Code**: `SIESGST_ADMIN_2026`  
> This code is required to create any admin/faculty account. Change it in `.env`.

---

## 📡 API Reference

### Student Auth
```
POST /api/auth/register   { name, prn, email, password, department }
POST /api/auth/login      { prn, password }
```

### Admin Auth
```
POST /api/admin/register  { name, email, password, role, department, adminSecret }
POST /api/admin/login     { email, password }
```
`role` can be: `faculty` or `super_admin`

### Complaints
```
GET    /api/complaints              → Students get own; Admin gets all
GET    /api/complaints/stats        → Count by status
POST   /api/complaints              { title, description, department }
PATCH  /api/complaints/:id/status   { status, adminNote } (Admin only)
DELETE /api/complaints/:id          (Admin only)
```
All complaint routes require: `Authorization: Bearer <token>`

---

## 🛠️ Common Issues

**"Cannot reach server" error in browser**
→ Make sure backend is running: `npm run dev` in the `backend/` folder

**"MongoDB connection failed"**
→ Start MongoDB service, or update `MONGO_URI` in `.env`

**"Invalid admin registration code"**
→ Use code: `SIESGST_ADMIN_2026` (or check your `.env`)

**CORS errors**
→ Backend allows all origins by default. If deploying, update `cors` origin in `server.js`.

---

## 🔒 Security Notes

- Passwords are **hashed with bcrypt** (salt rounds: 12)
- JWTs expire in **7 days**
- Admin creation requires a **secret code** — students cannot create admin accounts
- Sessions use **sessionStorage** (cleared on browser tab close / home page visit)
- No prior logins persist — `index.html` always runs `sessionStorage.clear()`

---

*SGMS Elite — Powered by SIES GST Secure Framework 2026*
