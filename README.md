# NextHRM

NextHRM is a sample Human Resource Management (HRM) dashboard built with **Next.js** and **TypeScript**.  It uses **NextAuth** for authentication and Drizzle ORM with a Postgres database.  Prisma is kept for database migrations.

## Features

- Email, GitHub and guest authentication via NextAuth
- Role based modules (customers, employees and projects)
- Database access through Drizzle ORM
- Prisma migrations
- Tailwind CSS UI components
- Optional caching with Vercel KV

## Requirements

- Node.js 18+
- A PostgreSQL database
- (optional) Upstash Redis/Vercel KV credentials for caching

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file in the project root and supply the following variables:
   ```env
   POSTGRES_URL=postgres://user:password@localhost:5432/nexterp
   NEXTAUTH_SECRET=your-secret
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   EMAIL_SERVER_HOST=smtp.example.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=user@example.com
   EMAIL_SERVER_PASSWORD=pass
   EMAIL_FROM="Nexterp <no-reply@example.com>"
   REDIS_PREFIX=nexterp:
   # Vercel KV / Upstash
   KV_REST_API_URL=
   KV_REST_API_TOKEN=
   ```
3. Run database migrations:
   ```bash
   npm run migrate
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Visit `http://localhost:3000` in your browser.

## Login Flow

1. Open `/login`.
2. Sign in with email (magic link), GitHub, or the *Guest Login* option.
3. After logging in the first time you will be redirected to `/register_details` to fill in your name and choose a role.
4. Once completed you can access the dashboard modules.

## Project Structure

- `app/` – Next.js routes
- `app/api/` – API route handlers
- `drizzle/` – Drizzle ORM schemas
- `prisma/` – Prisma schema and migrations
- `lib/` – database and auth helpers
- `components/` – shared React components

## Useful Scripts

- `npm run dev` – start the dev server
- `npm run build` – generate production build
- `npm start` – run the built app
- `npm run migrate` – run Prisma migrations

## License

MIT
