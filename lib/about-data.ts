import { getExperienceVideoUrl, getPhotoUrl } from "@/lib/supabase-media";

export const heroPhoto = getPhotoUrl("hero.jpeg") ?? "/about/hero.jpeg";
export const whoAmIPhoto = getPhotoUrl("traveling.jpeg") ?? "/about/whoami.jpeg";
export const visualArchiveVideo =
  getExperienceVideoUrl("ieeeexpvideo.MOV") ?? "/experiences/IMG_4279.MOV";

export const aboutCards = [
  {
    title: "A Builder",
    image: getPhotoUrl("builder.png") ?? "/about/builder.png",
    text: "Software projects, art, jewelry, writing, music, drinks – they all have one thing in common that fuels me: authenticity. It is utterly beautiful to see your own hands make nothing become something. Although I don't think anything I've created will change the world drastically, I know that everything I've made will leave my fingerprint – my personality, memories, motivations – on the world.",
  },
  {
    title: "A Friend",
    image: getPhotoUrl("friend.png") ?? "/about/friend.png",
    text: "I am a messy amalgamation of my loved ones and community. ",
  },
  {
    title: "An Explorer",
    image: getPhotoUrl("explorer.png") ?? "/about/explorer.png",
    text: "I follow questions into codebases, books, circuits, galleries, and long walks.",
  },
];

export const captchaTiles = [
  {
    id: "tile-1",
    caption: "My favorite art piece",
    image: getPhotoUrl("art.jpeg") ?? "/captcha/art.jpeg",
  },
  {
    id: "tile-2",
    caption: "Best concert I've been to",
    image: getPhotoUrl("concerts.jpeg") ?? "/captcha/concerts.jpeg",
  },
  {
    id: "tile-3",
    caption: "Most memorable cosplay",
    image: getPhotoUrl("cosplays.jpeg") ?? "/captcha/cosplays.jpeg",
  },
  {
    id: "tile-4",
    caption: "We did lines of matcha",
    image: getPhotoUrl("drinks.jpeg") ?? "/captcha/drinks.jpeg",
  },
  {
    id: "tile-5",
    caption: "Coolest hackathon project",
    image: getPhotoUrl("knighthacks.jpeg") ?? "/captcha/hackathons.jpeg",
  },
  {
    id: "tile-6",
    caption: "The reason I hate Unity",
    image: getPhotoUrl("ieee.jpeg") ?? "/captcha/ieee.jpeg",
  },
  {
    id: "tile-7",
    caption: "My proudest jewelry creation",
    image: getPhotoUrl("jewelry.png") ?? "/captcha/jewelry.png",
  },
  {
    id: "tile-8",
    caption: "I like to organize hackathons",
    image: getPhotoUrl("knighthacks.jpeg") ?? "/captcha/knighthacks.jpeg",
  },
  {
    id: "tile-9",
    caption: "Prettiest place I've seen",
    image: getPhotoUrl("traveling.jpeg") ?? "/captcha/traveling.jpeg",
  },
];
