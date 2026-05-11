# Online Examination System (MERN)

Production-ready starter for an online exam platform.

**Stack:** React (Vite) + Tailwind + Chart.js • Node + Express • MongoDB (Mongoose) • JWT • bcrypt • Nodemailer

## Project Structure

```
exam-system/
├── server/      # Express API
└── client/      # React + Vite frontend
```

## Quick Start

### 1. Backend

```bash
cd server
cp .env.example .env       # fill in MONGO_URI, JWT_SECRET, SMTP_* etc.
npm install
npm run dev                # http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev                # http://localhost:5173
```

The Vite dev server proxies `/api` → `http://localhost:5000`.

## Environment Variables (server/.env)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/exam-system
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Email (OTP + notifications) — use Mailtrap, SendGrid, Resend SMTP, etc.
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Exam System <no-reply@exam.local>"
```

## Scope of this Starter (v1)

This v1 implements the **Auth + Roles** foundation requested, plus all the
"additional" UX features (email/OTP, pagination, search, toasts, skeletons,
randomization helpers). Exam/Question/Result domain models are scaffolded
with REST endpoints and admin/student dashboards so you can extend them.

Implemented:

- JWT auth (register/login), bcrypt password hashing
- Email OTP verification on signup, password-reset email
- Role-based middleware (`student` / `admin`)
- Mongoose models: `User`, `Exam`, `Question`, `Attempt`
- REST APIs: `/api/auth`, `/api/exams`, `/api/questions`, `/api/attempts`, `/api/users`
- Admin dashboard shell, Student dashboard shell, Login/Register/OTP/Profile pages
- Tailwind UI with dark mode, glassmorphism cards, sidebar layout, toasts, skeletons
- Pagination + search helpers, randomized question selection helper
- Centralized error handler, request validation, CORS, helmet, rate limiting

To extend (next iterations): full exam runner UI with anti-cheat, Chart.js
analytics dashboard, PDF result export, leaderboard. Hooks and routes are in
place — wire components to the existing endpoints.

## Deployment

- **Backend:** Render / Railway / Fly.io. Set env vars, `npm start`.
- **Frontend:** Vercel / Netlify. Build: `npm run build`, output: `dist/`.
  Set `VITE_API_URL` to your deployed API URL.
- **DB:** MongoDB Atlas free tier. Whitelist your server IP.

## Security Notes

- Always rotate `JWT_SECRET` in production.
- Enable HTTPS at the platform/CDN layer.
- Rate limiting is enabled on `/api/auth`.
- Never commit `.env`.
