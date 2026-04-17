'use client'
import Top from "@/components/top";
import Selector from "@/components/selector";
import Recommend from "@/components/recommend";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Top />
      <Selector />
      <Recommend />
    </div>
  );
}
