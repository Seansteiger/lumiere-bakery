import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');

async function seedEatery() {
    try {
        console.log("Authenticating as admin...");
        // Use generic admin credentials (assuming default setup, otherwise might fail if changed)
        // Alternative is to bypass auth if collections are public, but categories/products usually need admin to write
        await pb.admins.authWithPassword('admin@example.com', 'admin123456');

        console.log("Fetching old categories...");
        const oldCats = await pb.collection('categories').getFullList();

        console.log("Fetching old products...");
        const oldProds = await pb.collection('products').getFullList();

        console.log("Deleting old products...");
        for (const prod of oldProds) {
            await pb.collection('products').delete(prod.id);
        }

        console.log("Deleting old categories...");
        for (const cat of oldCats) {
            await pb.collection('categories').delete(cat.id);
        }

        console.log("Creating new Eatery categories...");
        const catBurgers = await pb.collection('categories').create({ name: 'Burgers', slug: 'burgers' });
        const catMeals = await pb.collection('categories').create({ name: 'Meals', slug: 'meals' });
        const catSnacks = await pb.collection('categories').create({ name: 'Snacks', slug: 'snacks' });

        console.log("Creating new Eatery products...");

        await pb.collection('products').create({
            category_id: catMeals.id,
            name: "Traditional Pap & Meat",
            slug: "traditional-pap-and-meat",
            description: "Hearty and authentic. Soft pap served with rich, slow-cooked beef stew and chakalaka.",
            price: 85,
            promo_price: 0,
            in_stock: true,
            is_hot: true,
            // generic Unsplash food image
            image_url: "https://images.unsplash.com/photo-1544025162-811114216834?auto=format&fit=crop&q=80&w=800",
            variations: {
                "Meat Option": ["Beef Stew", "Tripe (Mogodu)", "Grilled Chicken"],
                "Side": ["Chakalaka", "Spinach", "Cabbage"]
            }
        });

        await pb.collection('products').create({
            category_id: catBurgers.id,
            name: "Lumiere Classic Smashburger",
            slug: "lumiere-classic-smashburger",
            description: "Double beef patty smashed to perfection, melted cheddar, caramelized onions, and our secret house sauce on a brioche bun.",
            price: 110,
            promo_price: 95,
            in_stock: true,
            is_hot: true,
            image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
            variations: {
                "Cheese": ["Cheddar", "Swiss", "None"]
            }
        });

        await pb.collection('products').create({
            category_id: catSnacks.id,
            name: "Loaded Fries",
            slug: "loaded-fries",
            description: "Crispy skin-on fries smothered in cheese sauce, jalapenos, and crispy bacon bits.",
            price: 65,
            promo_price: 0,
            in_stock: true,
            is_hot: false,
            image_url: "https://images.unsplash.com/photo-1576107025878-4dd04cb4b6b6?auto=format&fit=crop&q=80&w=800"
        });

        console.log("Successfully migrated database to Eatery format!");

    } catch (err) {
        console.error("Migration failed:", err);
    }
}

seedEatery();
