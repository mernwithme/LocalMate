# LocalMate - Coimbatore Local Service Marketplace

![LocalMate Banner](https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80)

**LocalMate** is a full-stack, production-ready MERN (MongoDB, Express.js, React 19, Node.js) marketplace application tailored for Coimbatore, connecting local residents with verified service professionals including electricians, plumbers, vehicle mechanics, bike rentals, cleaning specialists, and tutors.

---

## Key Features

- **Modern Glassmorphic UI & Dark Mode**: Sleek aesthetics with curated HSL color palette (`#2563EB` Primary, `#0F172A` Slate, `#F59E0B` Accent), smooth micro-interactions via Framer Motion, and system dark mode toggle. No purple gradients or pill-shaped buttons.
- **Role-Based Access Control (RBAC)**:
  - **Guest**: Browse services, search, filter 13 Coimbatore sectors, view provider profiles.
  - **Customer**: Book services, process payments, save favorites, leave star reviews, manage bookings.
  - **Service Provider**: Publish & manage service listings (CRUD), accept/reject booking requests, track monthly earnings via Recharts analytics.
  - **Admin Panel**: Platform overview metrics, verify and approve provider credentials, manage users and categories.
- **Real-Time Communication**: Instant messaging and notification triggers powered by Socket.io.
- **Advanced Search & Filtering**: Area-based matching across Coimbatore (Gandhipuram, RS Puram, Peelamedu, etc.), sector filters, and budget comparison.
- **Civic Helplines Assistant**: Direct directory and guidance for Tamil Nadu public utilities (EB 1912, CM Helpline 1100, etc.).
- **Launch Compliant**:
  - Custom domain configured for `localmate.in` and `www.localmate.in`.
  - Crisp vector SVG favicon (`/favicon.svg`).
  - Dedicated legal policies: [Privacy Policy](/privacy) and [Terms and Conditions](/terms).
  - Authentic Coimbatore service photography and realistic local rates.

---

## Tech Stack

### Frontend (`/frontend`)
- **Core**: React 19 + Vite
- **Styling**: Tailwind CSS + Bootstrap Grid support + Glassmorphism utility design system
- **Icons & Animation**: Lucide React + React Icons + Framer Motion
- **State & Router**: React Router v7 + React Context (Auth, Theme, Socket)
- **Visualizations & UX**: Recharts + Swiper.js + React Hot Toast + React Hook Form

### Backend (`/backend`)
- **Runtime Framework**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Real-Time Engine**: Socket.io
- **Security & Auth**: JWT (JSON Web Tokens), bcryptjs password hashing, Helmet security headers, CORS, Rate Limiter, Cookie Parser, Express Validator
- **Utilities**: Multer, Cloudinary support, Morgan logging, Compression, Data Seeder

---

## Repository Folder Structure

```
LocalMate/
├── frontend/
│   ├── public/          # Vector SVG favicon (favicon.svg)
│   ├── src/
│   │   ├── components/  # Navbar, Footer, ServiceCard, CategoryCard, BookingModal, ReviewModal, StatCard
│   │   ├── context/     # AuthContext, ThemeContext, SocketContext
│   │   ├── pages/       # LandingPage, ServicesPage, ServiceDetailsPage, Dashboards, PrivacyPolicyPage, TermsPage
│   │   ├── services/    # Axios API interceptors & base URL config
│   │   ├── index.css    # Tailwind directives & glassmorphism CSS
│   │   ├── App.jsx      # Router & Protected routes
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/          # MongoDB connection setup with automatic fallback
│   ├── controllers/     # Auth, Service, Category, Booking, Review, Message, Admin controllers
│   ├── middleware/      # JWT protect, authorize role, error handler, multer upload
│   ├── models/          # User, Service, Category, Booking, Review, Message, Notification schemas
│   ├── routes/          # Express API routers
│   ├── utils/           # Database seeder script (`seed.js`)
│   ├── server.js        # Express & Socket.io server with custom domain CORS
│   └── .env             # Environment variables (CLIENT_URL, CUSTOM_DOMAIN)
└── README.md
```

---

## Quick Start & Setup Guide

### 1. Prerequisites
- Node.js `v18+` or `v24+` installed
- MongoDB installed locally (e.g., `mongodb://127.0.0.1:27017/localmate`) or MongoDB Atlas URI

### 2. Backend Setup
```bash
cd backend
npm install

# Start development server with auto-reload
npm run dev

# Populate database with Coimbatore demo services & accounts
npm run seed
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Custom Domain & DNS Setup

To connect the production domain `localmate.in`:

1. **DNS A Record**:
   - Host: `@`
   - Points to: Server IP (e.g., Vercel / Cloudflare / DigitalOcean IP: `76.76.21.21`)
2. **DNS CNAME Record**:
   - Host: `www`
   - Points to: `cname.vercel-dns.com` (or production host target)
3. **Backend CORS Configuration**:
   - `CLIENT_URL=http://localhost:5173,https://localmate.in,https://www.localmate.in`
   - `CUSTOM_DOMAIN=localmate.in`

---

## Demo Account Credentials

| Role | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@localmate.com` | `Password123!` | Book services, view receipts, chat |
| **Service Provider** | `provider@localmate.com` | `Password123!` | Manage services, view revenue charts, accept jobs |
| **Admin** | `admin@localmate.com` | `Password123!` | System stats, provider approvals, manage platform |

---

## API Endpoint Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user or provider | Public |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public |
| `GET` | `/api/services` | Query services (search, filter, sort) | Public |
| `GET` | `/api/services/:id` | Get single service breakdown | Public |
| `POST` | `/api/services` | Create new service listing | Provider / Admin |
| `POST` | `/api/bookings` | Create service booking & process payment | Customer |
| `GET` | `/api/bookings` | Get user booking history | Authenticated |
| `PUT` | `/api/bookings/:id/status` | Accept / Reject / Complete booking | Provider / Customer |
| `POST` | `/api/messages` | Send real-time chat message | Authenticated |
| `GET` | `/api/admin/stats` | Retrieve platform analytics | Admin Only |
| `PUT` | `/api/admin/users/:id/approve` | Verify provider account | Admin Only |

---

## Deployment Guide

- **Frontend (Vercel)**: Connect Git repo, set root directory to `frontend`, framework preset `Vite`. Assign domain `localmate.in`.
- **Backend (Render / Railway / VPS)**: Connect Git repo, set root directory to `backend`, build command `npm install`, start command `node server.js`.
- **Environment Variables**: Configure `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in host dashboards.

---

## License
Licensed under the MIT License.
