import {
  getExperienceVideoUrl,
  getPhotoUrl,
  withMediaPlaceholder,
} from "@/lib/supabase-media";

export const heroPhoto = withMediaPlaceholder(getPhotoUrl("hero.jpeg"));
export const whoAmIPhoto = withMediaPlaceholder(getPhotoUrl("traveling.jpeg"));
export const visualArchiveVideo = withMediaPlaceholder(
  getExperienceVideoUrl("ieeeexpvideo.MOV"),
);

export const whoIAmText =
  "I am a computer science student at the University of Central Florida’s Burnett Honors College and the Hackathon Lead for Knight Hacks IX. I have also completed two software engineering internships each at NVIDIA and BNY, working across low-level systems, AI, observability, and infrastructure. Although I love building things, I am just as interested in the questions that lead to them: why something works, who it serves, and how it could be better. Curiosity guides nearly everything I do, from the teams I lead to the projects I choose.";

export const myInterestsText =
  "Beyond computer science, I am usually making something or finding a new world to disappear into. I love Studio Ghibli films, cosplaying, drawing, making jewelry, and listening to beabadoobee, FKA twigs, Clairo, and EPIC: The Musical. I am also the kind of person who turns matcha, coffee, or bubble tea into a small experiment and makes drinks for my friends. When I am not building or creating, I love traveling and collecting new places, ideas, and stories to bring home.";

export const aboutCards = [
  {
    title: "A Builder",
    image: withMediaPlaceholder(getPhotoUrl("builder.png")),
    text: "Software projects, art, jewelry, writing, music, drinks – they all have one thing in common that fuels me: authenticity. It is utterly beautiful to see your own hands make nothing become something. Although I don't think anything I've created will change the world drastically, I know that everything I've made will leave my fingerprint – my personality, memories, motivations – on the world.",
  },
  {
    title: "A Friend",
    image: withMediaPlaceholder(getPhotoUrl("friend.png")),
    text: "I think I am an amalgamation of my friends and the interests they have shared with me. Each of them is a puzzle piece that has shaped part of my personality, from the music I listen to and the art I make to the way I see the world. I love spending time with them because they challenge my opinions and introduce me to perspectives I may never have considered alone. Who I am continues to change because of the people I am lucky enough to know.",
  },
  {
    title: "An Explorer",
    image: withMediaPlaceholder(getPhotoUrl("explorer.png")),
    text: "I love traveling because every unfamiliar place gives me something new to notice. Lately, I have explored Monterey, Santa Cruz, and Mount Tamalpais in California, spending hours along trails, cliffs, and beaches. I enjoy the small surprises along the way, from finding horseshoe crabs on the shore to seeing wild sea lions for the first time. More than anything, I am drawn to the unknown because it gives my curiosity somewhere new to go.",
  },
];

export const captchaTiles = [
  {
    id: "tile-1",
    caption: "My favorite art piece",
    image: withMediaPlaceholder(getPhotoUrl("art.jpeg")),
  },
  {
    id: "tile-2",
    caption: "Best concert I've been to",
    image: withMediaPlaceholder(getPhotoUrl("concerts.jpeg")),
  },
  {
    id: "tile-3",
    caption: "Most memorable cosplay",
    image: withMediaPlaceholder(getPhotoUrl("cosplays.jpeg")),
  },
  {
    id: "tile-4",
    caption: "We did lines of matcha",
    image: withMediaPlaceholder(getPhotoUrl("drinks.jpeg")),
  },
  {
    id: "tile-5",
    caption: "Coolest hackathon project",
    image: withMediaPlaceholder(getPhotoUrl("knighthacks.jpeg")),
  },
  {
    id: "tile-6",
    caption: "The reason I hate Unity",
    image: withMediaPlaceholder(getPhotoUrl("ieee.jpeg")),
  },
  {
    id: "tile-7",
    caption: "My proudest jewelry creation",
    image: withMediaPlaceholder(getPhotoUrl("jewelry.png")),
  },
  {
    id: "tile-8",
    caption: "I like to organize hackathons",
    image: withMediaPlaceholder(getPhotoUrl("knighthacks.jpeg")),
  },
  {
    id: "tile-9",
    caption: "Prettiest place I've seen",
    image: withMediaPlaceholder(getPhotoUrl("traveling.jpeg")),
  },
];
