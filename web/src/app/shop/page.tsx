import Link from "next/link";
import { createServerClient } from "../../lib/pocketbase";
import AddToCart from "../../components/AddToCart";
import ShopFilters from "../../components/ShopFilters";

export const revalidate = 60; // ISR Cache

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const resolvedParams = await searchParams;
  const pb = createServerClient();

  // Fetch categories
  const categories = await pb.collection('categories').getFullList({ sort: 'name' });

  // Fetch products
  let filterStr = 'in_stock = true';
  if (resolvedParams.category) {
    const matchedCat = categories.find(c => c.slug === resolvedParams.category);
    if (matchedCat) {
      filterStr += ` && category = "${matchedCat.id}"`;
    }
  }

  let sortStr = '-id';
  if (resolvedParams.sort === 'price_asc') sortStr = 'price';
  if (resolvedParams.sort === 'price_desc') sortStr = '-price';

  const products = await pb.collection('products').getList(1, 50, {
    filter: filterStr,
    sort: sortStr,
    fetch: (url, config) => fetch(url, { ...config, cache: 'no-store' })
  });

  return (
    <div className="px-4 md:px-10 py-12 mx-auto max-w-[1440px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">Our Bakery</h1>
          <p className="text-slate-500 dark:text-slate-400">Everything baked fresh daily in Johannesburg.</p>
        </div>

        <ShopFilters
          categories={categories}
          currentCategory={resolvedParams.category || ''}
          currentSort={resolvedParams.sort || ''}
        />
      </div>

      {products.items.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <span className="material-symbols-outlined text-5xl mb-4">search_off</span>
          <p className="text-lg">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.items.map((prod) => (
            <div key={prod.id} className="group bg-white dark:bg-white/5 rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-white/10 hover:border-primary/50 relative flex flex-col">
              <Link href={`/shop/${prod.slug}`} className="absolute inset-0 z-0"></Link>
              <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-slate-100 dark:bg-slate-800 shrink-0 pointer-events-none">
                {prod.promo_price > 0 && <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase z-10">Promo</span>}
                {prod.is_hot && !prod.promo_price && <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase z-10">Hot</span>}

                <img src={prod.image || 'https://via.placeholder.com/300'} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                <div className="pointer-events-auto">
                  <AddToCart
                    variant="icon"
                    product={{
                      id: prod.id,
                      name: prod.name,
                      price: prod.promo_price > 0 ? prod.promo_price : prod.price,
                      image: prod.image || '',
                      slug: prod.slug
                    }}
                  />
                </div>
              </div>
              <div className="px-1 flex flex-col flex-1 relative z-10 pointer-events-none">
                <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-tight mb-1 truncate">{prod.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-2 pb-2 h-10">{prod.description}</p>
                <div className="mt-auto flex items-center justify-between pointer-events-auto border-t border-slate-50 dark:border-white/5 pt-3">
                  <div className="flex flex-col">
                    {prod.promo_price > 0 && <span className="text-slate-400 line-through text-xs">R {prod.price.toFixed(2)}</span>}
                    <span className="text-primary font-bold text-lg leading-none">R {(prod.promo_price || prod.price).toFixed(2)}</span>
                  </div>
                  <Link href={`/shop/${prod.slug}`} className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-primary transition-colors">
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
