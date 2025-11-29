import BannerCarousel from "@/components/home/BannerCarousel";
import CategoryList from "@/components/home/CategoryList";
import YouTubeShorts from "@/components/home/YouTubeShorts";

export default function HomePage() {
  return (
    <main className="flex-1 bg-white">
      <YouTubeShorts />
      <BannerCarousel />
      <CategoryList />
    </main>
  );
}