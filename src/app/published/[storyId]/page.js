"use client";

import Home from "@/app/page";
import { useParams } from "next/navigation";

export default function Page() {
  const { storyId } = useParams();
  return storyId ? <Home storyIdParam={storyId} /> : "404";
}
