# 💼 Job Portal Management System

A production-grade full-stack Job Portal built with **Spring Boot** (backend) and **React.js** (frontend), backed by **MongoDB**.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Security, JWT |
| Database | MongoDB |
| Frontend | React 18, Vite, React Router v6 |
| Auth | JWT (JSON Web Tokens) with refresh tokens |
| File Storage | Local filesystem (cloud-ready abstraction) |
| Charts | Recharts |
| Forms | React Hook Form + Zod validation |

---

## 📁 Project Structure

```
job-portal/
├── src/                          # Spring Boot backend
│   └── main/java/com/jobportal/
│       ├── config/               # App, MongoDB, DataInitializer
│       ├── controller/           # REST controllers
│       ├── dto/                  # Request/Response DTOs
│       │   ├── request/
│       │   └── response/
│       ├── exception/            # Custom exceptions + GlobalExceptionHandler
│       ├── model/                # MongoDB documents
│       ├── repository/           # Spring Data MongoDB repos
│       ├── security/             # JWT, SecurityConfig, UserDetailsService
│       └── service/              # Business logic
├── frontend/                     # React frontend
│   └── src/
│       ├── api/                  # Axios API clients
│       ├── components/           # Reusable UI components
│       │   ├── layout/           # Sidebar, DashboardLayout
│       │   ├── jobs/             # JobCard
│       │   └── ui/               # Modal, Spinner, Pagination, etc.
│       ├── context/              # AuthContext
│       └── pages/                # All page components
│           ├── student/
│           ├── employer/
│           └── admin/
├── mongodb/                      # MongoDB scripts
│   └── sample-data.js
└── pom.xml
```

---

## ⚙️ Prerequisites

- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+** and **npm**
- **MongoDB 6+** (running locally on port 27017)

---

## 🛠️ Setup & Run

### 1. Start MongoDB

```bash
# Windows
mongod --dbpath C:\data\db

# macOS/Linux
mongod --dbpath /data/db
```

### 2. Backend Setup

```bash
# Navigate to project root
cd job-portal

# Build and run
mvn spring-boot:run
```

The backend starts at **http://localhost:8080/api**

> **Note:** Sample data (admin, employer, student accounts + 4 sample jobs) is auto-seeded on first run via `DataInitializer.java`.

### 3. Frontend Setup

```bash
cd job-portal/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend starts at **http://localhost:3000**

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jobportal.com | Admin@123 |
| Employer | employer@techcorp.com | Employer@123 |
| Student | student@example.com | Student@123 |

---

## 📡 API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset with token |
| GET | `/api/auth/verify-email?token=` | Verify email |
| POST | `/api/auth/refresh-token` | Refresh JWT |

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/me` | Get current user |
| PUT | `/api/profile/update` | Update profile |
| POST | `/api/profile/upload-resume` | Upload resume |
| POST | `/api/profile/upload-picture` | Upload profile picture |

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Search/filter jobs (public) |
| GET | `/api/jobs/{id}` | Get job details |
| POST | `/api/jobs` | Create job (EMPLOYER) |
| PUT | `/api/jobs/{id}` | Update job (EMPLOYER) |
| DELETE | `/api/jobs/{id}` | Delete job (EMPLOYER) |
| PATCH | `/api/jobs/{id}/status` | Update job status |
| GET | `/api/jobs/employer/my-jobs` | Get employer's jobs |

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications/apply` | Apply for job (STUDENT) |
| GET | `/api/applications/my-applications` | Student's applications |
| GET | `/api/applications/job/{jobId}` | Job applicants (EMPLOYER) |
| GET | `/api/applications/employer/all` | All employer applications |
| PATCH | `/api/applications/{id}/status` | Update status (EMPLOYER) |
| DELETE | `/api/applications/{id}/withdraw` | Withdraw (STUDENT) |

### Saved Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/student/saved-jobs/{jobId}` | Save a job |
| DELETE | `/api/student/saved-jobs/{jobId}` | Unsave a job |
| GET | `/api/student/saved-jobs` | Get saved jobs |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| GET | `/api/notifications/unread-count` | Unread count |
| PATCH | `/api/notifications/{id}/read` | Mark as read |
| PATCH | `/api/notifications/read-all` | Mark all read |
| DELETE | `/api/notifications/{id}` | Delete notification |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/student` | Student stats |
| GET | `/api/dashboard/employer` | Employer stats |
| GET | `/api/admin/dashboard` | Admin stats |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | All users |
| PATCH | `/api/admin/users/{id}/toggle-status` | Block/unblock user |
| GET | `/api/admin/jobs` | All jobs |
| DELETE | `/api/admin/jobs/{id}` | Delete any job |

---

## 📋 Sample API Requests

### Register
```json
POST /api/auth/register
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "password": "Password@123",
  "role": "STUDENT",
  "phone": "+1-555-0200"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "Student@123"
}
```

### Create Job
```json
POST /api/jobs
Authorization: Bearer <token>
{
  "title": "Full Stack Developer",
  "description": "We are looking for a talented full stack developer...",
  "category": "Software Development",
  "location": "Remote",
  "jobType": "FULL_TIME",
  "experienceLevel": "MID",
  "experienceMinYears": 2,
  "experienceMaxYears": 5,
  "salaryMin": 80000,
  "salaryMax": 120000,
  "skillsRequired": ["React", "Node.js", "MongoDB"],
  "workMode": "REMOTE",
  "status": "ACTIVE"
}
```

### Apply for Job
```json
POST /api/applications/apply
Authorization: Bearer <token>
Content-Type: multipart/form-data

application: {"jobId": "...", "coverLetter": "I am excited to apply..."}
resume: [file] (optional)
```

---

## 🎨 Features

### Student / Job Seeker
- ✅ Register, login, logout
- ✅ Create and update profile with skills, education, experience
- ✅ Upload resume (PDF/DOC/DOCX)
- ✅ Browse and search jobs with advanced filters
- ✅ Apply for jobs with cover letter
- ✅ Track application status (Applied → Under Review → Shortlisted → Hired/Rejected)
- ✅ Save/bookmark jobs
- ✅ Receive notifications for status updates
- ✅ Profile completeness score

### Employer
- ✅ Register, login, logout
- ✅ Company profile management
- ✅ Post, edit, delete jobs
- ✅ View applicants per job
- ✅ Filter applicants by status
- ✅ Shortlist/reject/hire applicants
- ✅ Add notes to applicants
- ✅ Dashboard analytics with charts
- ✅ Toggle job active/closed status

### Admin
- ✅ View all users (students + employers)
- ✅ Block/unblock accounts
- ✅ View all job postings
- ✅ Delete inappropriate jobs
- ✅ Platform statistics dashboard with charts

---

## 🔒 Security

- JWT authentication with refresh tokens
- BCrypt password hashing (strength 12)
- Role-based access control (STUDENT, EMPLOYER, ADMIN)
- Input validation with Bean Validation
- File upload validation (type + size)
- CORS configuration
- Centralized exception handling

---

## 🗄️ MongoDB Collections

- **users** — All user accounts with role-specific fields
- **jobs** — Job postings with full details
- **applications** — Job applications with status tracking
- **notifications** — User notifications
- **saved_jobs** — Bookmarked jobs

---

## 🚀 Production Deployment

### Environment Variables

```bash
# Backend
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jobportal
JWT_SECRET=your-very-long-secret-key-here
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
FILE_UPLOAD_DIR=/var/uploads

# Frontend
VITE_API_URL=https://your-api-domain.com/api
```

### Build for Production

```bash
# Backend
mvn clean package -DskipTests
java -jar target/job-portal-backend-1.0.0.jar

# Frontend
cd frontend
npm run build
# Serve dist/ with nginx or any static host
```

---

## 🔮 Future Enhancements

1. **Real-time notifications** with WebSockets
2. **AI-powered job recommendations** based on skills
3. **Interview scheduling** module
4. **Video interview** integration
5. **Resume parser** with AI
6. **Company reviews** by employees
7. **Salary insights** and market data
8. **Dark mode** toggle
9. **Mobile app** (React Native)
10. **LinkedIn/Google OAuth** integration
11. **Advanced analytics** with export to CSV/PDF
12. **Multi-language** support

---

## 📝 License

MIT License — free to use for educational and commercial purposes.
