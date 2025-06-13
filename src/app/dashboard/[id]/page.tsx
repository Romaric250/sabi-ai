import { prisma } from "@/lib/prisma";
import { transformRoadmap } from "@/lib/transform";
import { RoadmapStage } from "@/types/roadmap";
import { notFound } from "next/navigation";
import View from "./view";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  const roadmap = await prisma.roadmap.findUnique({
    where: { id },
  });

  if (!roadmap) {
    return notFound();
  }

  return <View roadmap={roadmap.content as unknown as RoadmapStage[]} />;
};

export default page;
