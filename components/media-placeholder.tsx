"use client";

/* eslint-disable @next/next/no-img-element */
import type { SyntheticEvent } from "react";
import { mediaPlaceholderImageUrl } from "@/lib/supabase-media";

export function handleImageFallback(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;

  if (image.src !== mediaPlaceholderImageUrl) {
    image.src = mediaPlaceholderImageUrl;
  }
}

export function PlaceholderMediaImage({
  alt = "",
  className,
  decorative = false,
}: {
  alt?: string;
  className: string;
  decorative?: boolean;
}) {
  return (
    <img
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? "true" : undefined}
      className={className}
      src={mediaPlaceholderImageUrl}
    />
  );
}
