import {
  getPhotoUrl,
  getPortfolioMediaUrl,
  withMediaPlaceholder,
} from "@/lib/supabase-media";

export const portfolioSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") ||
  "https://kaisprunger.com";

export const portfolioLogoUrl = getPortfolioMediaUrl("logo.png") ?? "/favicon.svg";
export const portfolioOgImageUrl = withMediaPlaceholder(getPhotoUrl("hero.jpeg"));
