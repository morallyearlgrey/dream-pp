import { ProjectsPage } from "@/components/projects-page";
import { getProjectsFromDb } from "@/lib/portfolio-db";

export const dynamic = "force-dynamic";

export default async function Projects() {
  const projects = await getProjectsForPage();

  return <ProjectsPage projects={projects} />;
}

async function getProjectsForPage() {
  try {
    return await getProjectsFromDb();
  } catch (error) {
    console.error("Projects page database read failed.", error);

    return [];
  }
}
