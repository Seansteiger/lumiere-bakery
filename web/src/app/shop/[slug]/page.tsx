import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "../../../lib/pocketbase";
import AddToCart from "../../../components/AddToCart";

export const revalidate = 60; // ISR Cache

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pb = createServerClient();

    let product;
    try {
        const records = await pb.collection('products').getList(1, 1, {
            filter: `slug = "${slug}"`,
            expand: 'category'
        });
        if (records.items.length === 0) {
            return notFound();
        }
        product = records.items[0];
    } catch (e) {
        return notFound(); // or handle error
    }

    const category = product.expand?.category;
    const currentPrice = product.promo_price > 0 ? product.promo_price : product.price;

    return (
        <div className="px-4 md:px-10 py-12 mx-auto max-w-[1440px]">
            <div className="text-sm text-slate-500 mb-8 flex flex-wrap items-center gap-2">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                {category && (
                    <>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <Link href={`/shop?category=${category.slug}`} className="hover:text-primary transition-colors capitalize">{category.name}</Link>
                    </>
                )}
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-900 dark:text-white font-medium capitalize">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-2xl bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-100 dark:border-white/5">
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-[100px] text-slate-300">image</span>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col pt-4">
                    <div className="flex gap-2 mb-4">
                        {product.is_hot && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 w-fit">
                                <span className="text-xs font-bold uppercase tracking-wider">Hot</span>
                            </div>
                        )}
                        {product.promo_price > 0 && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit">
                                <span className="text-xs font-bold uppercase tracking-wider">Promo</span>
                            </div>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-4 capitalize">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex text-yellow-400 text-lg">
                            <span className="material-symbols-outlined fill-current text-[20px]">star</span>
                            <span className="material-symbols-outlined fill-current text-[20px]">star</span>
                            <span className="material-symbols-outlined fill-current text-[20px]">star</span>
                            <span className="material-symbols-outlined fill-current text-[20px]">star</span>
                            <span className="material-symbols-outlined fill-current text-[20px]">star_half</span>
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 text-sm underline cursor-pointer">Reviews</span>
                    </div>

                    <div className="text-3xl font-bold text-primary mb-8 px-4 py-3 bg-slate-50 dark:bg-white/5 rounded-xl block border border-slate-100 dark:border-white/5">
                        R {currentPrice.toFixed(2)}
                        {product.promo_price > 0 && <span className="text-sm font-normal text-slate-500 line-through ml-2">R {product.price.toFixed(2)}</span>}
                    </div>

                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed whitespace-pre-wrap">
                        {product.description}
                    </p>

                    <div className="border-t border-slate-200 dark:border-slate-800 py-8 mb-8">
                        {product.in_stock ? (
                            <>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Quantity</h4>
                                <AddToCart
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price: currentPrice,
                                        image: product.image || '',
                                        slug: product.slug
                                    }}
                                />
                            </>
                        ) : (
                            <div className="text-red-500 font-bold text-lg flex items-center gap-2">
                                <span className="material-symbols-outlined">error</span> Out of Stock
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 text-sm text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-slate-50 dark:bg-white/5">
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-primary text-xl shrink-0">local_shipping</span>
                            <div>
                                <strong className="text-slate-900 dark:text-white block">Local Delivery or Collection</strong>
                                Available for pickup at Rosebank or delivery within 15km.
                            </div>
                        </div>
                        <div className="flex items-start gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <span className="material-symbols-outlined text-primary text-xl shrink-0">eco</span>
                            <div>
                                <strong className="text-slate-900 dark:text-white block">Finest Ingredients</strong>
                                Prepared with care using high-quality components.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
