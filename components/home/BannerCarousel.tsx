'use client';

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

interface Banner {
    id: number;
    image_url: string | null;
    link_url?: string;
}

export default function BannerCarousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            const { data, error } = await supabase
                .from('banner')
                .select('*')
                .eq('type', 'CENTER')
                .order('id', { ascending: true })
                .limit(20);

            if (error) console.error(error);
            else setBanners(data || []);

            setLoading(false);
        };

        fetchBanners();
    }, []);

    if (loading) {
        return <p className="text-gray-500 text-center">배너를 불러오는 중...</p>;
    }

    return (
        <div className="w-full flex">
            <div className="w-full max-w-screen-xl mx-auto px-10">
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom'
                    }}
                    spaceBetween={24}
                    slidesPerView={3}
                    loop={false}
                    className="w-full"
                >
                    {banners.map((banner) => (
                        <SwiperSlide key={banner.id}>
                            <div className="w-full aspect-[5/2] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-100">
                                {banner.image_url ? (
                                    banner.link_url ? (
                                        <a href={banner.link_url} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={banner.image_url}
                                                alt='배너'
                                                className="w-full h-full object-cover"
                                            />
                                        </a>
                                    ) : (
                                        <img
                                            src={banner.image_url}
                                            alt='배너'
                                            className="w-full h-full object-cover"
                                        />
                                    )
                                ) : (
                                    <div className="w-full h-full flex items-center">
                                        <span className="text-gray-400 text-4xl">🖼️</span>
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}

                    {/* 커스텀 네비게이션 버튼 추가*/}
                    <div className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </div>

                    <div className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>
                </Swiper>
            </div>
        </div>
    );
}