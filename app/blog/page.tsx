import { BlogSavedArchive } from "@/components/blog-saved-archive";
import { getPublishedBlogsFromDb } from "@/lib/portfolio-db";

export const dynamic = "force-dynamic";

export default async function Blog() {
  const blogs = await getBlogsForPage();

  return <BlogSavedArchive blogs={blogs} />;
}

async function getBlogsForPage() {
  try {
    return await getPublishedBlogsFromDb();
  } catch (error) {
    console.error("Blog page database read failed.", error);

    return [];
  }
}
