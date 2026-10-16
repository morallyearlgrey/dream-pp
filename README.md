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

The database stores object keys and metadata for media. The image and video
files are served from `public/portfoliomedia` with the site, so viewing them
does not use Supabase Storage egress.

Media folder mapping:

```txt
public/portfoliomedia/photos             about hero, about cards, captcha, blog/experience stills
public/portfoliomedia/projects           project pictures
public/portfoliomedia/project-videos     project videos
public/portfoliomedia/experience-videos  experience videos
public/portfoliomedia/skills             skill thumbnail/preview images
```

For database rows, store a media object key. The app maps existing Supabase
Storage URLs and `public/portfoliomedia/...` references to local paths too:

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

Set `NEXT_PUBLIC_SUPABASE_URL` only if database records contain Storage URLs
on a custom Supabase domain. It is not needed to serve local media. New media
must be added under `public/portfoliomedia` and deployed with the site.
