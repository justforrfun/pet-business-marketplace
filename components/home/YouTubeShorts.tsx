'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

interface YouTubeShort {
  id: number;
  url: string;
}

export default function YouTubeShorts() {
  const [shorts, setShorts] = useState<YouTubeShort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShorts = async () => {
      const { data, error } = await supabase
        .from('youtube_shorts')
        .select('*')
        .order('id', { ascending: true })
        .limit(6);

      if (error) console.error(error);
      else setShorts(data || []);

      setLoading(false);
    };

    fetchShorts();
  }, []);

  // YouTube URL에서 video ID 추출
  const getVideoId = (url: string): string | null => {
    try {
      // https://www.youtube.com/shorts/VIDEO_ID 형식
      const shortsMatch = url.match(/youtube\.com\/shorts\/([^/?]+)/);
      if (shortsMatch) return shortsMatch[1];

      // https://youtu.be/VIDEO_ID 형식
      const youtuBeMatch = url.match(/youtu\.be\/([^/?]+)/);
      if (youtuBeMatch) return youtuBeMatch[1];

      // https://www.youtube.com/watch?v=VIDEO_ID 형식
      const watchMatch = url.match(/[?&]v=([^&]+)/);
      if (watchMatch) return watchMatch[1];

      return null;
    } catch {
      return null;
    }
  };

  // YouTube Shorts 임베드 URL 생성
  const getEmbedUrl = (url: string): string | null => {
    const videoId = getVideoId(url);
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (loading) {
    return <p className="text-gray-500 text-center py-8">숏츠를 불러오는 중...</p>;
  }

  if (shorts.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex py-8">
      <div className="w-full max-w-screen-xl mx-auto px-10">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: '.swiper-button-next-shorts',
            prevEl: '.swiper-button-prev-shorts',
          }}
          spaceBetween={24}
          slidesPerView={6}
          loop={false}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
            1536: {
              slidesPerView: 6,
              spaceBetween: 24,
            },
          }}
          className="w-full"
        >
          {shorts.map((short) => {
            const embedUrl = getEmbedUrl(short.url);
            return (
              <SwiperSlide key={short.id}>
                <div className="w-full aspect-[9/16] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-100">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`YouTube Short ${short.id}`}
                    />
                  ) : (
                    <a
                      href={short.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      <span className="text-gray-400 text-4xl">▶️</span>
                    </a>
                  )}
                </div>
              </SwiperSlide>
            );
          })}

          {/* 커스텀 네비게이션 버튼 */}
          <div className="swiper-button-prev-shorts absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </div>

          <div className="swiper-button-next-shorts absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
        </Swiper>
      </div>
    </div>
  );
}

