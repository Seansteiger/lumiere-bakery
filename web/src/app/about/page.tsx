import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'About Us | Lumiere Eatery',
    description: 'Discover the story behind Lumiere Eatery, a Johannesburg family tradition of passion, community, and unforgettable meals.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#fcf9f5] dark:bg-[#150f0a] font-inter">
            {/* Hero Section */}
            <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1920')" }}
                />
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="relative z-20 text-center px-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-md">
                        Our Story
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-sm">
                        Born from a love of family dinners and the vibrant pulse of Johannesburg.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 md:py-24 px-4 md:px-10 max-w-4xl mx-auto">
                <div className="bg-white dark:bg-[#1a120b] p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 space-y-8">

                    <div className="flex items-center gap-4 mb-8">
                        <span className="material-symbols-outlined text-4xl text-primary">restaurant_menu</span>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">A Table for Everyone</h2>
                    </div>

                    <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                        <p>
                            Lumiere Eatery didn't start in a boardroom; it started around a cramped kitchen table in Rosebank. For generations, our family believed that the most important conversations happen over a shared plate of food. Whether it was Grandma's slow-cooked weekend stew or dad's famous weekend burgers, food was our love language.
                        </p>

                        <p>
                            In 2024, we decided to open our doors to the city we love. Johannesburg is a melting pot of cultures, rhythms, and tastes, and we wanted an eatery that reflected that exact energy. A place where you could grab a quick, mouth-watering smashburger during your lunch break, or sit down for a deeply comforting plate of traditional Pap & Meat after a long week.
                        </p>

                        <div className="my-10 p-8 bg-[#fcf9f5] dark:bg-white/5 rounded-2xl border-l-4 border-primary">
                            <p className="text-xl italic font-medium text-slate-800 dark:text-slate-200">
                                "We don't just serve meals; we serve the memories you make while eating them. We want every customer to leave feeling like they just had dinner at a friend's house."
                            </p>
                            <p className="mt-4 font-bold text-primary">— The Lumiere Founders</p>
                        </div>

                        <p>
                            We source our ingredients from local Gauteng farmers, ensuring every bite is fresh and supports our community. Every sauce is made from scratch, every bun is toasted to order, and every meal is plated with intention.
                        </p>

                        <p>
                            Whether you're celebrating a milestone, bringing the kids for a weekend treat, or just need a quiet corner with a great sandwich, there is a seat waiting for you here at Lumiere.
                        </p>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-white/10 mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20">
                            Book a Table
                        </Link>
                        <Link href="/shop" className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-transparent border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-xl hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors">
                            View Our Menu
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
