# Student Record Management System

A comprehensive web-based student record management system built with Next.js, featuring role-based access control, student CRUD operations, and data export capabilities.

## Features

### User Management
- **Role-based Authentication** (Admin & Staff roles)
- Secure session management with iron-session
- Password hashing with bcrypt

### Student Management
- **Add Students** - Staff and Admin can create new student records
- **Edit Students** - All authenticated users can update student information
- **Delete Students** - Admin-only permission for record deletion
- **Search & Filter** - Real-time search by name, student ID, program, year level, or email
- **Export to CSV** - Download complete student records

### Student Information Tracking
- Basic Information (ID, name, email, phone, dates)
- Philippine Address Format (street, barangay, city, province, postal code)
- Guardian Information
- Academic Details (program, year level, status)
- Status Management (active, inactive, graduated)

### UI/UX Features
- Responsive design with Tailwind CSS
- Real-time search functionality
- Modal dialogs with blur backdrop
- Statistics dashboard (total, active, graduated, inactive students)
- Student ID immutability protection

## Tech Stack

- **Framework:** Next.js 15.5.5 (App Router)
- **Database:** SQLite with Drizzle ORM
- **Authentication:** iron-session
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript

## Installation

### Prerequisites
- Node.js 20+ or Bun
- npm, yarn, pnpm, or bun

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd student-record-system
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Set up environment variables** (Optional)
Create a `.env.local` file:
```env
SESSION_SECRET=your_secret_key_at_least_32_characters_long
NODE_ENV=development
```

4. **Initialize and seed the database**
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. **Open the application**
Navigate to [http://localhost:3000](http://localhost:3000)

## Default Credentials

After running the seed script, use these credentials to login:

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Permissions:** Full access (view, add, edit, delete students)

### Staff Account
- **Username:** `staff`
- **Password:** `staff123`
- **Permissions:** View, add, and edit students (cannot delete)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate database migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with default users and sample data |

## Database Schema

### Users Table
- id, username, passwordHash, role, createdAt, updatedAt

### Students Table
- id, studentId (unique), fullName, email, phone, dateOfBirth, enrollmentDate
- Address: street, barangay, city, province, postalCode
- Guardian: guardianName, guardianPhone
- Academic: program, yearLevel, status
- Timestamps: createdAt, updatedAt

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── students/     # Student CRUD endpoints
│   ├── dashboard/        # Main dashboard page
│   ├── login/            # Login page
│   └── page.tsx          # Home page (redirects to dashboard)
├── components/           # React components
│   ├── DeleteConfirm.tsx # Delete confirmation modal
│   ├── Header.tsx        # Navigation header
│   ├── StudentForm.tsx   # Add/Edit student form
│   └── StudentTable.tsx  # Student data table
├── db/                   # Database configuration
│   ├── index.ts          # Database connection
│   ├── schema.ts         # Drizzle schema
│   └── seed.ts           # Seed script
└── lib/                  # Utility functions
    ├── auth.ts           # Authentication helpers
    └── password.ts       # Password hashing
```

## Security Features

- Password hashing with bcrypt
- HTTP-only secure session cookies
- Role-based access control (RBAC)
- Input validation on API endpoints
- Student ID immutability after creation
- CSRF protection via session-based auth

## License

MIT
