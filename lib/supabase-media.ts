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
    return source.startsWith("/") ? source : null;
  }

  const bucketName = getMediaBucketName();
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
