"use client";

import HeroSection from "@/components/dashboard/HeroSection";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleEnter = () => {
    router.push("/home");
  };

  return <HeroSection onEnter={handleEnter} />;
}
