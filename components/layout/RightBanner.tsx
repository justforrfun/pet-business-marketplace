'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

interface Banner {
  id: number;
  image_url: string | null;
  link_url?: string;
}

export default function RightBanner() {
  const pathname = usePathname();
  const [banners, setBanners] = useState<Banner[]>([]);

  // 배너를 숨길 페이지 경로 체크
  const shouldHideBanner = pathname?.startsWith('/board') || 
                           pathname === '/signup' || 
                           pathname === '/login';

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('banner')
        .select('*')
        .eq('type', 'RIGHT')
        .order('id', { ascending: true });

      if (!error && data) setBanners(data);
    };
    load();
  }, []);

  // 특정 페이지에서는 배너 숨기기
  if (shouldHideBanner) return null;

  return (
    <aside
      className="
        hidden lg:flex
        fixed
        right-20
        top-[calc(50%+32px)] -translate-y-1/2
        w-32
        h-[580px]
        flex-col
        items-center
        z-50
      "
    >
      <div className="relative w-full h-full">
        {/* ▲ 위 화살표 */}
        <div
          className="
    banner-prev
    absolute top-1 left-1/2 -translate-x-1/2
    w-8 h-8
    flex items-center justify-center
    cursor-pointer z-20
  "
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M7 13l5-5 5 5"
            />
          </svg>
        </div>

        {/* ▼ 아래 화살표 */}
        <div
          className="
    banner-next
    absolute bottom-1 left-1/2 -translate-x-1/2
    w-8 h-8
    flex items-center justify-center
    cursor-pointer z-20
  "
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M7 11l5 5 5-5"
            />
          </svg>
        </div>
        <Swiper
          direction="vertical"
          slidesPerView={4}
          navigation={{
            nextEl: '.banner-next',
            prevEl: '.banner-prev',
          }}
          modules={[Navigation]}
          spaceBetween={12} // 확실히 보이게 됨
          className="w-full h-full pt-10 pb-10"
        >
          {banners.map((b) => (
            <SwiperSlide key={b.id}>
              <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md">
                {b.image_url ? (
                  <img
                    src={b.image_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    이미지
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </aside>
  );
}
