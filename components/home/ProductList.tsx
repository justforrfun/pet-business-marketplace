'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Product {
    id: number;
    name: string;
    image_url: string | null;
    tags: string[] | null;
    category_id: number;
}

export default function ProductList({ selectedCategory }: { selectedCategory: number | null; }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            let query = supabase
                .from('product')
                .select('*')
                .order('id', { ascending: true });

            if (selectedCategory !== null) {
                query = query.eq('category_id', selectedCategory);
            }
            const { data, error } = await query;

            if (error) console.error(error);
            else setProducts(data || []);

            const parsed = data?.map((item) => ({
                ...item,
                tags: [item.tag1, item.tag2].filter(Boolean)
            }));

            setProducts(parsed || []);

            setLoading(false);
        };
        fetchProducts();
    }, [selectedCategory]);

    if (loading) {
        return <p className="text-gray-500 text-center">상품을 불러오는 중...</p>;
    }

    if (products.length === 0) {
        return <p className="text-gray-500 text-center">선택한 카테고리 내 상품이 없습니다.</p>;
    }

    return (
        <div className="grid grid-cols-4 md:grid-cols-4 gap-8 justify-start">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="flex flex-col items-start bg-white rounded-lg"
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
        </div >
    );
}