import { BlogSavedArchive } from "@/components/blog-saved-archive";
import { getCachedPublishedBlogsFromDb } from "@/lib/portfolio-db";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = createPageMetadata({
  description:
    "Field notes, saved posts, technical notes, and editorial fragments from Kai Sprunger's software and creative archive.",
  path: "/blog",
  title: "Field Notes",
});

export default async function Blog() {
  const blogs = await getBlogsForPage();

  return <BlogSavedArchive blogs={blogs} />;
}

async function getBlogsForPage() {
  try {
    return await getCachedPublishedBlogsFromDb();
  } catch (error) {
    console.error("Blog page database read failed.", error);

    return [];
  }
}
