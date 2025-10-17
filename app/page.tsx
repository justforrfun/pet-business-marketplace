import BannerCarousel from "@/components/home/BannerCarousel";
import BannerCarouse from "@/components/home/BannerCarousel";
import CategoryList from "@/components/home/CategoryList";

export default function HomePage() {
  return (
    <main className="flex-1 bg-white">
      <BannerCarousel />
      <CategoryList />
    </main>
  );
}