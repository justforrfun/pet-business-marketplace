'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import ProductList from './ProductList';

interface Category {
  id: number;
  name: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

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
    <section className="w-full py-8">
      <div className="w-full max-w-[1440px] mx-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          카테고리별 상품
        </h2>

        {/* 카테고리 버튼 */}
        <div className="flex gap-2 mb-10 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedCategory === null
                ? 'bg-red-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-red-700 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 상품 목록 */}
        <ProductList selectedCategory={selectedCategory} />
      </div>
    </section>
  );
}
