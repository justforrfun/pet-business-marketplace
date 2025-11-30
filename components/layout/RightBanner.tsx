'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export default function RightBanner() {
  const pathname = usePathname();
  const [banners, setBanners] = useState<any[]>([]);
  const [hideBanner, setHideBanner] = useState(false);

  // 게시글 상세 페이지에서는 배너 숨기기
  const isBoardDetailPage =
    pathname?.startsWith('/board/') &&
    pathname !== '/board' &&
    pathname !== '/board/write';

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

  // 🔥 화면 Zoom 여부 체크
  useEffect(() => {
    const checkZoom = () => {
      const zoom = window.innerWidth / window.outerWidth;

      // zoom < 1 → 100%보다 커진 상태 (110%, 125%, 150% 등)
      setHideBanner(zoom < 1);
    };

    checkZoom();
    window.addEventListener('resize', checkZoom);
    return () => window.removeEventListener('resize', checkZoom);
  }, []);

  // 게시글 상세 페이지이거나 zoom 상태일 때 배너 숨기기
  if (hideBanner || isBoardDetailPage) return null;

  return (
    <aside
      className="
        hidden lg:flex
        fixed
        right-10
        top-1/2 -translate-y-1/2
        w-44
        h-[760px]        /* 🔥 4개 배너 + 간격 정확히 반영한 높이 */
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
    w-10 h-10
    flex items-center justify-center
    cursor-pointer z-20
  "
        >
          <svg
            className="w-6 h-6 text-white"
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
    w-10 h-10
    flex items-center justify-center
    cursor-pointer z-20
  "
        >
          <svg
            className="w-6 h-6 text-white"
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
          className="w-full h-full pt-14 pb-14" /* 화살표 공간 확보 */
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
