'use client';

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

interface Category {
    id: number;
    name: string;
}

export default function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fecthCategories = async () => {
            const { data, error } = await supabase
                .from('category')
                .select('id, name')
                .order('id', { ascending: true });

            if (error) {
                console.error('Error fetching categories:', error.message);
            } else {
                setCategories(data || []);
            }
        };

        fecthCategories();
    }, []);

    return (
        <section className="mt-12 px-10">
            <h2 className="text-xl font-bold mb-6 text-gray-800">카테고리별 상품</h2>
            <div className="grid grid-cols-6 gap-4">
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <div
                            key={category.id}
                            className="border border-gray-200 rounded-lg py-3 text-center text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                            {category.name}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm col-span-6 text-center">
                        카테고리를 불러오는 중...
                    </p>
                )}
            </div>
        </section>
    );
}