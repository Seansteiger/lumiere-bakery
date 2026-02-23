import Image from "next/image";
import Link from "next/link";
import { createServerClient } from "../lib/pocketbase";
import AddToCart from "../components/AddToCart";

export const revalidate = 60; // ISR cache

async function getCategories() {
  const pb = createServerClient();
  try {
    return await pb.collection('categories').getFullList({ sort: 'name' });
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getTrendingProducts() {
  const pb = createServerClient();
  try {
    return await pb.collection('products').getList(1, 4, {
      filter: 'is_hot = true && in_stock = true',
      sort: '-id',
      fetch: (url, config) => fetch(url, { ...config, cache: 'no-store' })
    });
  } catch (err) {
    console.error(err);
    return { items: [] };
  }
}

export default async function Home() {
  const [categories, trending] = await Promise.all([
    getCategories(),
    getTrendingProducts()
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full px-4 md:px-10 py-8 mx-auto max-w-[1440px]">
        <div className="@container bg-white dark:bg-[#1a120b] rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5">
          <div className="flex flex-col-reverse lg:flex-row min-h-[500px]">
            {/* Content Side */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-16 gap-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit">
                <span className="material-symbols-outlined text-sm font-bold">verified</span>
                <span className="text-xs font-bold uppercase tracking-wider">Voted Best in JHB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                Experience the <span className="text-primary">Art</span> of Baking
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                Handcrafted with passion in the heart of Johannesburg. From our signature sourdough to bespoke wedding cakes, taste the difference of premium ingredients.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/book" className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold transition-transform active:scale-95 shadow-lg shadow-primary/25">
                  Book a Tasting
                </Link>
                <Link href="/shop" className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-white dark:bg-transparent border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors">
                  Order Online
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                <div className="flex -space-x-3">
                  <img alt="Customer avatar" className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1a120b] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHy9MJfNFFQiGsI8MXcnRYyE7n1d0Csuoudre6mTQJd7ss_boWpn4352_gzsPcl7mWl2ai95OtjTubvrmiD5AOtZbI1EfJ6DImMGVTWgSCpYzuXQshQzgu63rncb4Cj7nNqugoauy8cPm3QXqi7jxsEI1zxvCm68p1v6bwPWdpuFoyOqBuSr530znKjFyF9mE-KsGWbeV_phmMluIewCg0t41vqFDrZWUSyoyjn_ZCSnJRcOtgIMj3nsAhzlxMyYOOLixSitA2g8Y" />
                  <img alt="Customer avatar" className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1a120b] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAezCySy1GkfYoJhO5uFhNObujH1LWLinBc0xuFrr6eRILEFEuQD7htWNL3LQecEv73GeivOIT8KWDigC3y2P1lXV4rUaAI3ltUz5n-1cnfKGzIt7tCv7_eIkXhABj0qHE-Gp-N-JiyzeQgntNapK0jX7qfozKme2TTenkV9fUyz7LoFC5ngUl80xi8kJ6OsmJoAeetiAW5QD39MhdIYP4fsGcLRhax_aQmWNFDXo4q0LoN0uZDc4eaBsT5dQHu4jtzPbilMo8nhBE" />
                  <img alt="Customer avatar" className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1a120b] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3el50yHraB5A3jc6OnkAw9P-pBCn3Zgfg-hcjxBTprRzpLJn13cJqt13fUePF4bHQsinJFhO5BP_4hKo0AcIkH5u80Pu3HVjG5HCl_xq8mCQmMIVWHENOk8YnYuP7muBZmchDl7a2JL-vSm5uItudkUG_wOFFG2ilHHB_w5E2KJTLgAxAM2gtcHhfeGR84qblQpx9GZ6dVRoif8EI5QS3POXHp1susnjmDoXzqefcXY7qpY4ap10w3Si-gAav-zZWwDgo-N_dUE" />
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1a120b] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">+2k</div>
                </div>
                <div className="text-sm">
                  <div className="flex text-yellow-400 text-base">
                    <span className="material-symbols-outlined fill-current text-[18px]">star</span>
                    <span className="material-symbols-outlined fill-current text-[18px]">star</span>
                    <span className="material-symbols-outlined fill-current text-[18px]">star</span>
                    <span className="material-symbols-outlined fill-current text-[18px]">star</span>
                    <span className="material-symbols-outlined fill-current text-[18px]">star</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400">Happy Customers</span>
                </div>
              </div>
            </div>
            {/* Image Side */}
            <div className="flex-1 relative min-h-[300px] lg:min-h-full">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDSY6oGms-RUggAJh7_wHyunfBZoUGMM-obhe6G7HWOjuvprTcEOTx8eFYqVwH-d9vR4hRqtuo1JhsgIdeZ6j2eEgeaGW0vgWwelttNTZe5dg1Wkgdsgu-FrS8IaIkj_divj4ZEr-d_P9kebZVK8OgzXNMKXQbL30GNhaSLJK7bnpQuJj9XgEACMbnwjJTGjFjVsUaEdM4S-QHjqmYOHbrBaL7notbXN0EifYCxfdN3mAcE5fXhjJiV735ulewjuf4LcnaMA5WGrr0')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-12 px-4 md:px-10 mx-auto max-w-[1440px]">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Featured Collections</h2>
            <p className="text-slate-500 dark:text-slate-400">Curated categories for every occasion</p>
          </div>
          <Link className="hidden md:flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all" href="/shop">
            View All Categories <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} className="group relative overflow-hidden rounded-xl aspect-[4/3] sm:aspect-square lg:aspect-[4/5] shadow-md hover:shadow-xl transition-shadow" href={`/shop?category=${cat.slug}`}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${cat.image}')` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-white text-2xl font-bold mb-2">{cat.name}</h3>
                <p className="text-white/80 text-sm line-clamp-2 mb-4 group-hover:text-white transition-colors">{cat.description}</p>
                <div className="flex items-center text-white font-medium text-sm">
                  <span>Explore</span>
                  <span className="material-symbols-outlined text-base ml-1 transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-12 bg-white dark:bg-[#1a120b] border-y border-slate-100 dark:border-white/5">
        <div className="px-4 md:px-10 mx-auto max-w-[1440px]">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Trending Now</h2>
            <div className="flex gap-2">
              <Link href="/shop" className="text-primary font-bold hover:underline mb-1 hidden md:block">Shop All</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.items.map((prod) => (
              <div key={prod.id} className="group bg-background-light dark:bg-white/5 rounded-xl p-3 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-white/10 relative">
                <Link href={`/shop/${prod.slug}`} className="absolute inset-0 z-0"></Link>
                <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-white pointer-events-none">
                  {prod.promo_price > 0 && <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase z-10">Promo</span>}
                  {prod.is_hot && !prod.promo_price && <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase z-10">Hot</span>}

                  <img alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={prod.image || 'https://via.placeholder.com/300?text=No+Image'} />

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
                <div className="px-1 relative z-10 pointer-events-none">
                  <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-tight mb-1 truncate">{prod.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 truncate">{prod.description}</p>
                  <div className="flex items-center justify-between pointer-events-auto">
                    <div>
                      {prod.promo_price > 0 && <span className="text-slate-400 line-through text-xs mr-1">R {prod.price.toFixed(2)}</span>}
                      <span className="text-primary font-bold text-lg">R {(prod.promo_price || prod.price).toFixed(2)}</span>
                    </div>
                    <div className="flex text-yellow-400 text-xs">
                      <span className="material-symbols-outlined fill-current text-[14px]">star</span>
                      <span className="text-slate-400 ml-1">{prod.rating?.toFixed(1) || '5.0'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 md:px-10 mx-auto max-w-[1440px]">
        <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 md:p-12 lg:px-20 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Join the Inner Circle</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">Unlock <span className="font-bold text-primary">15% OFF</span> your first online order. Be the first to know about new seasonal menus and tasting events.</p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                <input className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Enter your email address" type="email" />
                <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all whitespace-nowrap">
                  Get My Code
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">We respect your privacy. Unsubscribe at any time.</p>
            </div>

            <div className="flex-shrink-0 relative hidden md:block">
              <div className="w-64 h-64 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                <img alt="Close up of a baker dusting sugar on pastries" className="relative z-10 w-full h-full object-cover rounded-full border-8 border-white dark:border-[#1a120b] shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVlKytWN1Xx3VyUIncQbhIdv2lLb2W_aNT9LOy_kgbzS5ptpa_zF53QiGHiKXiaJQiXFoWQtwTR0CS3QGjlHaCxvElI9Z7dp5_kiAfgFau_KxsK3toJcmJaVHbvgjImlBM4NSuLFU_a6O7I-Sh3_xf892RPH6AA94OACHhA7KUtfmdtc_3z1AUkGnj9FId5nzkn9nFhzp8tgkmkw-SbrHVuXfrCodfcK_WcEvtNmuSDXwBDwwReVr05txAXsTvGBptyrW-ist8YWE" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
