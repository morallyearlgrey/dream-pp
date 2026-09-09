import { ProjectsPage } from "@/components/projects-page";
import { getCachedProjectsFromDb } from "@/lib/portfolio-db";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = createPageMetadata({
  description:
    "Selected software and hardware projects from Kai Sprunger, including AI control systems, computer vision games, tariff tools, hackathon infrastructure, ridesharing, and RISC-V processors.",
  path: "/projects",
  title: "Projects",
});

export default async function Projects() {
  const projects = await getProjectsForPage();

  return <ProjectsPage projects={projects} />;
}

async function getProjectsForPage() {
  try {
    return await getCachedProjectsFromDb();
  } catch (error) {
    console.error("Projects page database read failed.", error);

    return [];
  }
}
