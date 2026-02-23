import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');

async function seedEateryExtended() {
    try {
        console.log("Authenticating as admin...");
        // Auth with the local superuser we upserted
        await pb.admins.authWithPassword('admin@example.com', 'admin123456');

        console.log("Fetching old products...");
        const oldProds = await pb.collection('products').getFullList();

        console.log("Deleting old products to make way for the new catalog...");
        for (const prod of oldProds) {
            await pb.collection('products').delete(prod.id);
        }

        console.log("Fetching categories...");
        const cats = await pb.collection('categories').getFullList();
        const catMap = {};
        cats.forEach(c => catMap[c.slug] = c.id);

        // Ensure we have our categories if they don't exist
        if (!catMap['burgers']) {
            const b = await pb.collection('categories').create({ name: 'Burgers', slug: 'burgers' });
            catMap['burgers'] = b.id;
        }
        if (!catMap['meals']) {
            const m = await pb.collection('categories').create({ name: 'Meals', slug: 'meals' });
            catMap['meals'] = m.id;
        }
        if (!catMap['snacks']) {
            const s = await pb.collection('categories').create({ name: 'Snacks', slug: 'snacks' });
            catMap['snacks'] = s.id;
        }
        if (!catMap['sweets']) {
            const sw = await pb.collection('categories').create({ name: 'Sweets', slug: 'sweets' });
            catMap['sweets'] = sw.id;
        }

        console.log("Injecting 10+ detailed mock products...");

        const newProducts = [
            {
                category_id: catMap['meals'],
                name: "Traditional Pap & Meat",
                slug: "traditional-pap-and-meat",
                description: "Hearty and authentic. Soft pap served with rich, slow-cooked beef stew and chakalaka.",
                price: 85,
                promo_price: 0,
                in_stock: true,
                is_hot: true,
                image_url: "https://images.unsplash.com/photo-1544025162-811114216834?auto=format&fit=crop&q=80&w=800",
                variations: {
                    "Meat Option": ["Beef Stew", "Tripe (Mogodu)", "Grilled Chicken"],
                    "Side": ["Chakalaka", "Spinach", "Cabbage"]
                }
            },
            {
                category_id: catMap['burgers'],
                name: "Lumiere Classic Smashburger",
                slug: "lumiere-classic-smashburger",
                description: "Double beef patty smashed to perfection, melted cheddar, caramelized onions, and our secret house sauce on a brioche bun.",
                price: 110,
                promo_price: 95,
                in_stock: true,
                is_hot: true,
                image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
                variations: { "Cheese": ["Cheddar", "Swiss", "None"] }
            },
            {
                category_id: catMap['snacks'],
                name: "Fully Loaded Fries",
                slug: "fully-loaded-fries",
                description: "Crispy skin-on fries smothered in rich cheese sauce, spicy jalapenos, and crispy bacon bits.",
                price: 65,
                promo_price: 0,
                in_stock: true,
                is_hot: false,
                image_url: "https://images.unsplash.com/photo-1576107025878-4dd04cb4b6b6?auto=format&fit=crop&q=80&w=800"
            },
            {
                category_id: catMap['meals'],
                name: "Spicy Peri-Peri Chicken Half",
                slug: "spicy-peri-peri-chicken",
                description: "Flame-grilled half chicken basted in our authentic Mozambican peri-peri sauce. Served with a side of your choice.",
                price: 135,
                promo_price: 120,
                in_stock: true,
                is_hot: true,
                image_url: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800",
                variations: {
                    "Spice Level": ["Mild", "Hot", "Extra Hot", "Lemon & Herb"],
                    "Side": ["Chips", "Rice", "Side Salad"]
                }
            },
            {
                category_id: catMap['burgers'],
                name: "The Fried Chicken Sandie",
                slug: "fried-chicken-sandie",
                description: "Crispy buttermilk fried chicken breast, tangy slaw, and spicy mayo on a toasted sesame bun.",
                price: 95,
                promo_price: 0,
                in_stock: true,
                is_hot: false,
                image_url: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&q=80&w=800"
            },
            {
                category_id: catMap['meals'],
                name: "Gourmet Mac & Cheese",
                slug: "gourmet-mac-and-cheese",
                description: "A rich blend of gouda, cheddar, and parmesan folded into tender macaroni and topped with a crispy herb crumb.",
                price: 80,
                promo_price: 0,
                in_stock: true,
                is_hot: false,
                image_url: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&q=80&w=800",
                variations: { "Add Protein": ["None", "Bacon Bits (+R15)", "Pulled Pork (+R25)"] }
            },
            {
                category_id: catMap['snacks'],
                name: "Crispy Onion Rings",
                slug: "crispy-onion-rings",
                description: "Thick-cut onion rings, beer-battered and fried until golden brown. Served with garlic aioli.",
                price: 45,
                promo_price: 0,
                in_stock: true,
                is_hot: false,
                image_url: "https://images.unsplash.com/photo-1639024471210-618bf5d35d94?auto=format&fit=crop&q=80&w=800"
            },
            {
                category_id: catMap['sweets'],
                name: "Decadent Chocolate Lava Cake",
                slug: "decadent-chocolate-lava-cake",
                description: "Warm, rich chocolate cake with a molten center. Served with a scoop of artisanal vanilla bean ice cream.",
                price: 75,
                promo_price: 0,
                in_stock: true,
                is_hot: true,
                image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800"
            },
            {
                category_id: catMap['meals'],
                name: "Jozi Style Kota",
                slug: "jozi-style-kota",
                description: "The ultimate street-food classic. A hollowed-out quarter loaf packed with chips, russian sausage, cheese, and atchar.",
                price: 65,
                promo_price: 0,
                in_stock: true,
                is_hot: true,
                image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800",
                variations: { "Sauce": ["BBQ & Mustard", "Tomato & Mayo", "Chutney & Atchar"] }
            },
            {
                category_id: catMap['burgers'],
                name: "Plant-Based Perfection Burger",
                slug: "plant-based-perfection",
                description: "100% plant-based patty, vegan cheese, fresh lettuce, tomato, and vegan mayo on a gluten-free bun.",
                price: 125,
                promo_price: 0,
                in_stock: true,
                is_hot: false,
                image_url: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&q=80&w=800"
            }
        ];

        for (const prodData of newProducts) {
            await pb.collection('products').create(prodData);
        }

        console.log("Successfully injected 10 new products to PocketBase!");

    } catch (err) {
        console.error("Migration failed:", err);
    }
}

seedEateryExtended();
