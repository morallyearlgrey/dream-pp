export type SkillCategory = "languages" | "frameworks" | "libraries" | "tools";

export type FeaturedEndorsementRecord = {
  id: string;
  authorName: string;
  note: string;
  createdAt?: string;
};

export type ExperienceRecord = {
  id: string;
  companyName: string;
  positionName: string;
  fromDate: string;
  toDate: string | null;
  summary: string;
  responsibilities: string[];
  photos: string[];
  mainVideo: string | null;
  endorsements?: FeaturedEndorsementRecord[];
};

export type ProjectRecord = {
  id: string;
  name: string;
  fromDate: string;
  toDate: string | null;
  summary: string;
  whatIDid: string;
  photos: string[];
  mainVideo: string | null;
  projectLink: string | null;
  toolsUsed: string[];
  backgroundMedia?: string | null;
  carouselMedia?: string | null;
};

export type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  photos: string[];
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SkillRecord = {
  id: string;
  photo: string;
  name: string;
  category: SkillCategory;
};

export type DashboardExperienceRecord = {
  id: string;
  companyName: string;
};

export type DashboardEndorsementRecord = {
  id: string;
  experienceId: string;
  authorName: string;
  note: string;
  approved: boolean;
  featured: boolean;
  createdAt: string;
};

export type PortfolioCounts = {
  blogs: number;
  endorsements: number;
  experiences: number;
  projects: number;
  skills: number;
};

export type DashboardPortfolioData = {
  databaseBacked: boolean;
  counts: PortfolioCounts;
  endorsements: DashboardEndorsementRecord[];
  experiences: DashboardExperienceRecord[];
};
