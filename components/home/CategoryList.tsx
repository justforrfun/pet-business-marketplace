'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import ProductList from './ProductList';

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('category')
        .select('id, name, parent_id')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error.message);
      } else {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, []);

  const parentCategories = categories.filter((c) => c.parent_id === null);
  const childCategories = categories.filter(
    (c) => c.parent_id === selectedParent
  );

  const handleParentClick = (parentId: number | null) => {
    setSelectedParent(parentId);
    setSelectedChild(null);
  };

  return (
    <section className="w-full py-8">
      <div className="w-full max-w-[1440px] mx-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          카테고리별 상품
        </h2>

        {/* 1차 카테고리 버튼 */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => handleParentClick(null)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedParent === null
                ? 'bg-red-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체
          </button>

          {parentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleParentClick(category.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedParent === category.id
                  ? 'bg-red-700 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 2차 카테고리 버튼 */}
        {selectedParent !== null && childCategories.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setSelectedChild(null)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedChild === null
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체
            </button>

            {childCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedChild(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedChild === category.id
                    ? 'bg-red-500 text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6">
          {/* 상품 목록 */}
          <ProductList
            selectedParent={selectedParent}
            selectedChild={selectedChild}
            childCategoryIds={childCategories.map((c) => c.id)}
          />
        </div>
      </div>
    </section>
  );
}
