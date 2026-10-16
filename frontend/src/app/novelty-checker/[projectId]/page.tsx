"use client";

import { useParams } from "next/navigation";
import NoveltyCheckerClient from "@/components/novelty/NoveltyCheckerClient";

export default function ProjectNoveltyCheckerPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  return <NoveltyCheckerClient projectId={projectId} />;
}
