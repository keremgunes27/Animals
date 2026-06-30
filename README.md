# Animals — Animal Management App

A CRUD application for managing animals, built with Supabase for authentication and role-based access control. Admin users can add, edit, and delete animals; regular users can only view the list.

---

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Supabase** — Auth, PostgreSQL database, Storage
- **SweetAlert2** — Confirmation and notification dialogs

---

## Features

### Authentication
- Email and password login (`signInWithPassword`)
- Cookie-based session management (`@supabase/ssr`)
- Route protection and session refresh via middleware

### Role-Based Authorization
| Role | Permissions |
|------|-------------|
| `user` | View animal list |
| `admin` | View + add + edit + delete |

Roles are fetched from the Supabase `profiles` table.

### Animal CRUD
- **List** — Image, name, average weight, and creation date
- **Add** — Name, optional image upload, optional weight (admin only)
- **Edit** — Loads existing data; if a new image is uploaded, the old one is deleted from storage (admin only)
- **Delete** — SweetAlert2 confirmation dialog, record and storage image deleted together (admin only)

---

## Project Structure

```
animals/
├── app/
│   ├── page.tsx                  # Login page
│   ├── layout.tsx                # Root layout
│   ├── animals/
│   │   ├── page.tsx              # Animal list
│   │   ├── add/page.tsx          # Add animal (admin)
│   │   └── edit/[id]/page.tsx    # Edit animal (admin)
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       └── animals/
│           ├── route.ts           # GET — list
│           ├── add/route.ts       # POST
│           ├── edit/[id]/route.ts # GET, PUT
│           └── delete/[id]/route.ts # DELETE
├── components/
│   ├── Header.tsx                # Navbar: user info, role badge, logout
│   ├── AnimalTable.tsx           # List table
│   └── AnimalForm.tsx            # Shared add/edit form
├── contexts/
│   └── UserContext.tsx           # Session and isAdmin state
├── lib/supabase/
│   ├── auth.ts                   # SSR auth client (cookie-based)
│   ├── server.ts                 # Admin client (secret key)
│   └── middleware.ts             # updateSession helper
├── types/
│   ├── animal.ts
│   └── user.ts
└── middleware.ts                 # Route protection
```

---

## Database Schema

### `animals` Table
| Column | Type | Notes |
|--------|------|-------|
| `id` | number | Primary key |
| `name` | string | Required |
| `image` | string \| null | Supabase Storage public URL |
| `avarage_weight` | number \| null | Average weight (kg) |
| `created_at` | timestamp | Auto-generated |

### `profiles` Table
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Matches `auth.users.id` |
| `role` | string | `"admin"` or `"user"` |

### Storage
- **Bucket:** `animals`
- Images are uploaded with a UUID filename and stored as a public URL

---

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | — | Login |
| `/api/auth/logout` | POST | — | Logout |
| `/api/auth/me` | GET | Logged in | Current user |
| `/api/animals` | GET | Logged in | List all animals |
| `/api/animals/add` | POST | Admin | Add new animal |
| `/api/animals/edit/[id]` | GET, PUT | Admin | Get / update animal |
| `/api/animals/delete/[id]` | DELETE | Admin | Delete animal |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

### 3. Create tables in Supabase

Create the `animals` and `profiles` tables in the Supabase Dashboard using the schema above. Link the `id` column in `profiles` to `auth.users`.

### 4. Start the development server

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

---

## Auth Flow

```
Login (/api/auth/login)
  → signInWithPassword
  → Cookies are set
  → Redirected to /animals

Every request
  → middleware: updateSession (refresh session)
  → Redirect to / if not logged in
  → Role check for admin-only routes

Logout (/api/auth/logout)
  → signOut
  → Cookies cleared
  → Redirected to /
```
