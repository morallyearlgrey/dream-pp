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

The database stores object keys and metadata for uploaded media. Store the
actual image and video files in the Supabase Storage `portfoliomedia` bucket.

Media folder mapping:

```txt
portfoliomedia/photos             about hero, about cards, captcha, blog/experience stills
portfoliomedia/projects           project pictures
portfoliomedia/project-videos     project videos
portfoliomedia/experience-videos  experience videos
portfoliomedia/skills             skill thumbnail/preview images
```

For database rows, store either a full URL or a bucket object key. Prefer object
keys so the app can build the Supabase CDN URL automatically:

```txt
projects.photos        ["anr.png"]
projects.main_video    anrvideo.mov
experiences.photos     ["hero.jpeg"]
experiences.main_video nvidiaexpvideo.mov
skills.photo           01-languages-python.png
blogs.photos           ["traveling.jpeg"]
```

The `skills` table can be seeded from the curated skill list:

```bash
pnpm run db:seed:skills
```

Seed the selected project and experience records:

```bash
pnpm run db:seed:portfolio
```

Generate Drizzle migrations after schema changes:

```bash
pnpm exec drizzle-kit generate
```

## Vercel

Set these environment variables in Vercel:

```txt
DATABASE_URL
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET
NEXT_PUBLIC_SUPABASE_PHOTOS_PREFIX
NEXT_PUBLIC_SUPABASE_PROJECTS_PREFIX
NEXT_PUBLIC_SUPABASE_PROJECT_VIDEOS_PREFIX
NEXT_PUBLIC_SUPABASE_EXPERIENCE_VIDEOS_PREFIX
NEXT_PUBLIC_SUPABASE_SKILLS_PREFIX
NEXTAUTH_URL
NEXTAUTH_SECRET
DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET
ADMIN_DISCORD_ID
```

`AUTH_SECRET`, `AUTH_DISCORD_ID`, and `AUTH_DISCORD_SECRET` are accepted as
Auth.js-compatible aliases. If no standalone auth secret is configured, the
server derives a stable signing secret from `DISCORD_CLIENT_SECRET`; the raw
Discord secret is never stored in the session.

When the Supabase Vercel integration provides `POSTGRES_URL` instead of
`DATABASE_URL`, the application uses it automatically. `POSTGRES_PRISMA_URL`
and `POSTGRES_URL_NON_POOLING` are also supported as fallbacks.

Make the `portfoliomedia` bucket public if you want the site to render direct
public media URLs from the browser. For a private bucket, add a signed URL API
route instead of using public object URLs.
