'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function ShopFilters({ categories, currentCategory, currentSort }: { categories: any[], currentCategory: string, currentSort: string }) {
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const form = e.target.form;
        if (form) {
            const formData = new FormData(form);
            const category = formData.get('category') as string;
            const sort = formData.get('sort') as string;

            const params = new URLSearchParams();
            if (category) params.set('category', category);
            if (sort) params.set('sort', sort);

            router.push(`/shop?${params.toString()}`);
        }
    };

    return (
        <form className="flex gap-3">
            <select name="category" defaultValue={currentCategory} onChange={handleChange} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a120b] text-sm outline-none">
                <option value="">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
            </select>
            <select name="sort" defaultValue={currentSort} onChange={handleChange} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a120b] text-sm outline-none">
                <option value="">Sort by: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
            </select>
        </form>
    );
}
