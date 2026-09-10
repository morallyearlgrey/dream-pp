export type SupabaseMediaBucket =
  | "experienceVideos"
  | "photos"
  | "projectVideos"
  | "projects"
  | "skills";

const defaultMediaBucketName = "portfoliomedia";
const configuredMediaBucketName = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET;

const defaultFolderNames: Record<SupabaseMediaBucket, string> = {
  experienceVideos: "experience-videos",
  photos: "photos",
  projectVideos: "project-videos",
  projects: "projects",
  skills: "skills",
};

const configuredFolderNames: Record<SupabaseMediaBucket, string | undefined> = {
  experienceVideos: process.env.NEXT_PUBLIC_SUPABASE_EXPERIENCE_VIDEOS_PREFIX,
  photos: process.env.NEXT_PUBLIC_SUPABASE_PHOTOS_PREFIX,
  projectVideos: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_VIDEOS_PREFIX,
  projects: process.env.NEXT_PUBLIC_SUPABASE_PROJECTS_PREFIX,
  skills: process.env.NEXT_PUBLIC_SUPABASE_SKILLS_PREFIX,
};

const legacyPublicPrefixes: Record<SupabaseMediaBucket, string[]> = {
  experienceVideos: ["experiences/"],
  photos: ["about/", "captcha/", "experiences/"],
  projectVideos: ["projects/"],
  projects: ["projects/"],
  skills: [],
};

export const mediaPlaceholderImageUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1000'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%235E1C23'/%3E%3Cstop offset='0.56' stop-color='%238f2b35'/%3E%3Cstop offset='1' stop-color='%23171311'/%3E%3C/linearGradient%3E%3CradialGradient id='r' cx='0.72' cy='0.18' r='0.58'%3E%3Cstop offset='0' stop-color='%23f2e5c6' stop-opacity='0.18'/%3E%3Cstop offset='1' stop-color='%23f2e5c6' stop-opacity='0'/%3E%3C/radialGradient%3E%3Cpattern id='p' width='56' height='56' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 55H56M55 0V56' fill='none' stroke='%23f2e5c6' stroke-opacity='0.08'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='1600' height='1000' fill='url(%23g)'/%3E%3Crect width='1600' height='1000' fill='url(%23r)'/%3E%3Crect width='1600' height='1000' fill='url(%23p)'/%3E%3C/svg%3E";

export function getSupabaseMediaUrl(
  bucket: SupabaseMediaBucket,
  value: string | null | undefined,
) {
  const source = value?.trim();

  if (!source) {
    return null;
  }

  if (/^(?:https?:|data:|blob:)/i.test(source)) {
    return source;
  }

  const supabaseUrl = getSupabaseUrl();

  if (!supabaseUrl) {
    return mediaPlaceholderImageUrl;
  }

  const bucketName = getMediaBucketName();
  const publicObjectPrefix = `public/${bucketName}/`;
  const normalizedSource = source.replace(/^\/+/, "");

  if (normalizedSource.startsWith(publicObjectPrefix)) {
    const publicObjectPath = normalizedSource.slice(publicObjectPrefix.length);

    return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${encodeObjectPath(publicObjectPath)}`;
  }

  const folderName = getFolderName(bucket);
  const objectKey = normalizeObjectKey(bucket, bucketName, folderName, source);
  const fullObjectPath = folderName ? `${folderName}/${objectKey}` : objectKey;

  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${encodeObjectPath(fullObjectPath)}`;
}

export function getSupabaseMediaUrls(
  bucket: SupabaseMediaBucket,
  values: string[] | null | undefined,
) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => getSupabaseMediaUrl(bucket, value))
    .filter((value): value is string => Boolean(value));
}

export function getPortfolioMediaUrl(value: string | null | undefined) {
  return getSupabaseMediaUrlWithoutFolder(value);
}

export function getExperienceVideoUrl(value: string | null | undefined) {
  return getSupabaseMediaUrl("experienceVideos", value);
}

export function getPhotoUrl(value: string | null | undefined) {
  return getSupabaseMediaUrl("photos", value);
}

export function getPhotoUrls(values: string[] | null | undefined) {
  return getSupabaseMediaUrls("photos", values);
}

export function getProjectImageUrl(value: string | null | undefined) {
  return getSupabaseMediaUrl("projects", value);
}

export function getProjectImageUrls(values: string[] | null | undefined) {
  return getSupabaseMediaUrls("projects", values);
}

export function getProjectVideoUrl(value: string | null | undefined) {
  return getSupabaseMediaUrl("projectVideos", value);
}

export function getSkillImageUrl(value: string | null | undefined) {
  return getSupabaseMediaUrl("skills", value);
}

export function isVideoMediaUrl(value: string | null | undefined) {
  return Boolean(value && /\.(mov|mp4|webm)(?:$|[?#])/i.test(value));
}

export function withMediaPlaceholder(value: string | null | undefined) {
  return value ?? mediaPlaceholderImageUrl;
}

function getSupabaseUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!rawUrl) {
    return "";
  }

  return rawUrl.replace(/\/+$/, "");
}

function getMediaBucketName() {
  return (
    configuredMediaBucketName?.trim().replace(/^\/+|\/+$/g, "") ||
    defaultMediaBucketName
  );
}

function getSupabaseMediaUrlWithoutFolder(value: string | null | undefined) {
  const source = value?.trim();

  if (!source) {
    return null;
  }

  if (/^(?:https?:|data:|blob:)/i.test(source)) {
    return source;
  }

  const supabaseUrl = getSupabaseUrl();

  if (!supabaseUrl) {
    return source.startsWith("/") ? source : null;
  }

  const bucketName = getMediaBucketName();
  let objectKey = source.replace(/^\/+/, "");
  const storagePrefix = "storage/v1/object/public/";
  const storagePrefixIndex = objectKey.indexOf(storagePrefix);

  if (storagePrefixIndex >= 0) {
    objectKey = objectKey.slice(storagePrefixIndex + storagePrefix.length);
  }

  if (objectKey.startsWith(`${bucketName}/`)) {
    objectKey = objectKey.slice(bucketName.length + 1);
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${encodeObjectPath(objectKey)}`;
}

function getFolderName(bucket: SupabaseMediaBucket) {
  return (
    configuredFolderNames[bucket]?.trim().replace(/^\/+|\/+$/g, "") ||
    defaultFolderNames[bucket]
  );
}

function normalizeObjectKey(
  bucket: SupabaseMediaBucket,
  bucketName: string,
  folderName: string,
  value: string,
) {
  let objectKey = value.replace(/^\/+/, "");
  const storagePrefix = "storage/v1/object/public/";
  const storagePrefixIndex = objectKey.indexOf(storagePrefix);

  if (storagePrefixIndex >= 0) {
    objectKey = objectKey.slice(storagePrefixIndex + storagePrefix.length);
  }

  if (objectKey.startsWith(`${bucketName}/`)) {
    objectKey = objectKey.slice(bucketName.length + 1);
  }

  if (folderName && objectKey.startsWith(`${folderName}/`)) {
    objectKey = objectKey.slice(folderName.length + 1);
  }

  for (const prefix of legacyPublicPrefixes[bucket]) {
    if (objectKey.startsWith(prefix)) {
      objectKey = objectKey.slice(prefix.length);
      break;
    }
  }

  return objectKey;
}

function encodeObjectPath(value: string) {
  const suffixIndex = value.search(/[?#]/);
  const path = suffixIndex === -1 ? value : value.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? "" : value.slice(suffixIndex);

  return `${path
    .split("/")
    .map((segment) => encodePathSegment(segment))
    .join("/")}${suffix}`;
}

function encodePathSegment(segment: string) {
  try {
    return encodeURIComponent(decodeURIComponent(segment));
  } catch {
    return encodeURIComponent(segment);
  }
}
