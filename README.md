# Personal Portfolio

Next.js App Router portfolio with React, Tailwind CSS, Framer Motion, Discord
sign-in scaffolding, PostgreSQL, and Drizzle ORM.

## Local development

Run commands from the project root, not from `app`.

```bash
cd ~/dream-pp
```

This project is set up with pnpm. Avoid mixing npm and pnpm in the same
`node_modules` folder.

1. Install dependencies.

   ```bash
   pnpm install
   ```

2. Create `.env.local` from `.env.example`.

   ```bash
   cp .env.example .env.local
   ```

3. Add a PostgreSQL connection string and Discord OAuth credentials.

4. Run the app.

   ```bash
   pnpm run dev
   ```

## Database

The database stores URLs and metadata for uploaded media. Store actual image and
video files in object storage such as Vercel Blob, UploadThing, or Cloudinary.

Generate Drizzle migrations after schema changes:

```bash
npx drizzle-kit generate
```

## Vercel

Set these environment variables in Vercel:

```txt
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET
```

Add object storage variables for the provider you choose, then deploy the app to
Vercel from the connected repository.
