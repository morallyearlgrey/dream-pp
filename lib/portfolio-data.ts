export const aboutCards = [
  {
    title: "A Builder",
    image: "/about/builder.png",
    text: "Software projects, art, jewelry, writing, music, drinks – they all have one thing in common that fuels me: authenticity. It is utterly beautiful to see your own hands make nothing become something. Although I don't think anything I've created will change the world drastically, I know that everything I've made will leave my fingerprint – my personality, memories, motivations – on the world.",
  },
  {
    title: "A Friend",
    image: "/about/friend.png",
    text: "I am a messy amalgamation of my loved ones and community. ",
  },
  {
    title: "An Explorer",
    image: "/about/explorer.png",
    text: "I follow questions into codebases, books, circuits, galleries, and long walks.",
  },
];

export const captchaTiles = [
  { id: "tile-1", caption: "My favorite art piece", image: "/captcha/art.jpeg" },
  { id: "tile-2", caption: "Best concert I've been to", image: "/captcha/concerts.jpeg" },
  { id: "tile-3", caption: "Most memorable cosplay", image: "/captcha/cosplays.jpeg" },
  { id: "tile-4", caption: "We did lines of matcha", image: "/captcha/drinks.jpeg" },
  { id: "tile-5", caption: "Coolest hackathon project", image: "/captcha/hackathons.jpeg" },
  { id: "tile-6", caption: "The reason I hate Unity", image: "/captcha/ieee.jpeg" },
  { id: "tile-7", caption: "My proudest jewelry creation", image: "/captcha/jewelry.png" },
  { id: "tile-8", caption: "I like to organize hackathons", image: "/captcha/knighthacks.jpeg" },
  { id: "tile-9", caption: "Prettiest place I've seen", image: "/captcha/traveling.jpeg" },
];

export const experiencesSeed = [
  {
    id: "embedded-lab",
    companyName: "Signal Atelier",
    positionName: "Embedded Software Developer",
    fromDate: "Jan 2025",
    toDate: "Present",
    summary:
      "Built firmware-adjacent tooling for sensor prototypes, hardware bring-up, and test workflows.",
    responsibilities: [
      "Designed serial debugging tools for prototype boards.",
      "Created repeatable hardware validation notes for team review.",
      "Improved data capture loops across firmware and analysis scripts.",
    ],
    photos: ["/references/experiences.jpg", "/references/projects.jpg", "/about/hero-hq.jpeg"],
    mainVideo: "/experiences/IMG_0118.mov",
  },
  {
    id: "design-systems",
    companyName: "Northline Studio",
    positionName: "Frontend Engineer",
    fromDate: "Jun 2024",
    toDate: "Dec 2024",
    summary:
      "Shipped expressive React interfaces for dense internal tools and editorial landing pages.",
    responsibilities: [
      "Built reusable Tailwind components with accessible states.",
      "Translated motion concepts into Framer Motion interactions.",
      "Partnered with designers to sharpen responsive page systems.",
    ],
    photos: ["/references/aboutme.jpg", "/references/experiences.jpg", "/about/whoami.jpeg"],
    mainVideo: "/experiences/IMG_4279.MOV",
  },
];

export const projectsSeed = [
  {
    id: "portfolio-engine",
    name: "Portfolio Engine",
    fromDate: "Mar 2026",
    toDate: "Jul 2026",
    summary:
      "A personal publishing system for visual work, project case studies, and notes.",
    whatIDid:
      "I shaped the data model, built the interactive visual language, and prepared the admin surface for blog publishing and endorsement moderation.",
    photos: ["/references/projects.jpg", "/references/aboutme.jpg"],
    mainVideo: "/projects/IMG_1775 2.MOV",
    projectLink: "#",
    toolsUsed: ["Next.js", "Tailwind", "Drizzle", "PostgreSQL"],
  },
  {
    id: "sensor-notebook",
    name: "Sensor Notebook",
    fromDate: "Jan 2026",
    toDate: "Mar 2026",
    summary:
      "A lab notebook concept that turns prototype sensor traces into searchable visual notes.",
    whatIDid:
      "I designed the capture flow, modeled readings as timeline entries, and prototyped the visual comparison interface for repeat experiments.",
    photos: ["/references/experiences.jpg", "/references/projects.jpg"],
    mainVideo: "/projects/IMG_1967.MOV",
    projectLink: "#",
    toolsUsed: ["React", "Postgres", "Python", "Embedded C"],
  },
  {
    id: "reading-room",
    name: "Reading Room",
    fromDate: "Sep 2025",
    toDate: "Nov 2025",
    summary:
      "A calm archive for books, annotations, themes, and cross-linked reading questions.",
    whatIDid:
      "I created the taxonomy, designed the reading card UI, and added tooling for turning highlights into publishable notes.",
    photos: ["/references/aboutme.jpg", "/references/projects.jpg"],
    mainVideo: "/projects/IMG_2431.MOV",
    projectLink: "#",
    toolsUsed: ["TypeScript", "Next.js", "MDX", "Design"],
  },
  {
    id: "motion-lab",
    name: "Motion Lab",
    fromDate: "May 2025",
    toDate: "Aug 2025",
    summary:
      "A collection of animation experiments for interfaces that need atmosphere without losing clarity.",
    whatIDid:
      "I prototyped motion states, built reusable timing presets, and tested interactions across mobile and laptop layouts.",
    photos: ["/references/projects.jpg", "/references/experiences.jpg"],
    mainVideo: "/projects/IMG_2443.MOV",
    projectLink: "#",
    toolsUsed: ["Framer Motion", "Tailwind", "React"],
  },
];

export const blogSeed = [
  {
    id: "hello-archive",
    title: "Hello, Archive",
    slug: "hello-archive",
    photos: ["/references/aboutme.jpg"],
    content:
      "A starter entry for future essays, project notes, and visual process writing.",
    published: false,
    createdAt: "2026-07-22",
    updatedAt: "2026-07-22",
  },
];

export const skillsSeed = [
  { id: "ts", photo: "/references/projects.jpg", name: "TypeScript", category: "languages" },
  { id: "react", photo: "/references/aboutme.jpg", name: "React", category: "libraries" },
  { id: "next", photo: "/references/projects.jpg", name: "Next.js", category: "frameworks" },
  { id: "drizzle", photo: "/references/experiences.jpg", name: "Drizzle ORM", category: "tools" },
];

export const endorsementsSeed = [
  {
    id: "note-1",
    experienceId: "embedded-lab",
    authorName: "Team Lead",
    note: "Kai translates ambiguous prototype work into calm, testable steps.",
    approved: true,
    featured: true,
    createdAt: "2026-07-12",
  },
  {
    id: "note-2",
    experienceId: "design-systems",
    authorName: "Design Partner",
    note: "The motion details felt intentional without ever getting in the way.",
    approved: true,
    featured: true,
    createdAt: "2026-07-15",
  },
];
