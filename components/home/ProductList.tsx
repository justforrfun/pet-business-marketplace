'use client';

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Product {
    id: number;
    name: string;
    image_url: string | null;
    link_url?: string | null;
    tags: string[] | null;
    category_id: number;
}

export default function ProductList({ selectedCategory }: { selectedCategory: number | null; }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 12;

    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setProducts([]);
        setPage(0);
        setHasMore(true);
        loadProducts(0);
    }, [selectedCategory]);

    const loadProducts = async (pageIdx: number) => {
        setLoading(true);

        const from = pageIdx * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('product')
            .select('*')
            .order('id', { ascending: true })
            .range(from, to);

        if (selectedCategory) {
            query = query.eq('category_id', selectedCategory);
        }

        console.log('selected category: ', selectedCategory);

        const { data, error } = await query;
        if (error) console.error(error);

        if (data && data.length > 0) {
            const parsed = data.map((item) => ({
                ...item,
                tags: [item.tag1, item.tag2].filter(Boolean)
            }));

            setProducts((prev) => [...prev, ...parsed]);
            if (data.length < limit) {
                setHasMore(false);
            }
        } else {
            setHasMore(false);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (!observerRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && hasMore && !loading) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    loadProducts(nextPage);
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [page, hasMore, loading]);

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-4 gap-8">
                {products.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => {
                            if (product.link_url) {
                                window.open(product.link_url, '_blank');
                            }
                        }}
                        className="flex flex-col items-start bg-white rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        {/* 이미지 영역 */}
                        <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-400 text-4xl">🖼️</span>
                            )}
                        </div>

                        {/* 상품명 */}
                        <p className="mt-4 text-base font-medium text-gray-900 text-left min-h-[1.5rem]">
                            {product.name}
                        </p>

                        {/* 태그 리스트 */}
                        <div className="flex flex-wrap justify-start gap-2 mt-3 mb-4">
                            {product.tags?.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-0.5 text-xs font-medium border border-[#950E1B] bg-[#FAE6E8] text-[#5A1E24] rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 상품 없을 때 표시 */}
            {!loading && products.length === 0 && (
                <p className="text-gray-500 text-center">선택한 카테고리 내 상품이 없습니다.</p>
            )}

            {/* 로딩 표시 */}
            {loading && <p className="text-gray-500 text-center">불러오는 중...</p>}

            {/* 옵저버 트리거 (무한 스크롤 감지용) */}
            <div ref={observerRef} className="h-10" />
        </div >


    );
}