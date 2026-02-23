import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');

async function setupDB() {
    try {
        // Authenticate as Admin
        await pb.admins.authWithPassword('nsdsekatane@gmail.com', '2026Bakery.');
        console.log('✅ Logged in successfully as admin.');

        // Check if schemas already exist. Try to fetch collections
        const collections = await pb.collections.getFullList();
        const existingNames = collections.map(c => c.name);
        console.log('📦 Existing collections:', existingNames.join(', '));

        // Define standard rules
        const listRule = "";
        const viewRule = "";

        // 1. Categories
        if (!existingNames.includes('categories')) {
            console.log('Creating "categories" collection...');
            await pb.collections.create({
                name: 'categories',
                type: 'base',
                system: false,
                schema: [
                    { name: 'name', type: 'text', required: true, unique: true },
                    { name: 'slug', type: 'text', required: true, unique: true },
                    { name: 'description', type: 'text' },
                    { name: 'image', type: 'url' }
                ],
                listRule, viewRule
            });
            console.log('✅ Created "categories"');
        }

        // 2. Products
        if (!existingNames.includes('products')) {
            console.log('Creating "products" collection...');
            await pb.collections.create({
                name: 'products',
                type: 'base',
                system: false,
                schema: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'slug', type: 'text', required: true, unique: true },
                    { name: 'description', type: 'text' },
                    { name: 'price', type: 'number', required: true },
                    { name: 'promo_price', type: 'number' },
                    { name: 'category', type: 'relation', required: true, options: { collectionId: 'categories', cascadeDelete: false, minSelect: 1, maxSelect: 1 } },
                    { name: 'image', type: 'url' },
                    { name: 'in_stock', type: 'bool' },
                    { name: 'is_hot', type: 'bool' },
                    { name: 'reviews_count', type: 'number' },
                    { name: 'rating', type: 'number' }
                ],
                listRule, viewRule
            });
            console.log('✅ Created "products"');
        }

        // 3. Orders
        if (!existingNames.includes('orders')) {
            console.log('Creating "orders" collection...');
            await pb.collections.create({
                name: 'orders',
                type: 'base',
                system: false,
                schema: [
                    { name: 'user_id', type: 'relation', options: { collectionId: 'users', maxSelect: 1 } },
                    { name: 'customer_name', type: 'text', required: true },
                    { name: 'customer_email', type: 'email', required: true },
                    { name: 'customer_phone', type: 'text' },
                    { name: 'items', type: 'json' },
                    { name: 'total_amount', type: 'number', required: true },
                    { name: 'status', type: 'select', options: { maxSelect: 1, values: ['pending', 'paid', 'fulfilled', 'cancelled'] } },
                    { name: 'fulfillment_type', type: 'text' },
                    { name: 'booking_date', type: 'date' },
                    { name: 'booking_time', type: 'text' },
                    { name: 'yoco_transaction_id', type: 'text' }
                ],
                // ONLY admin can list/view orders for now
                createRule: ""
            });
            console.log('✅ Created "orders"');
        }

        // 4. Coupons
        if (!existingNames.includes('coupons')) {
            console.log('Creating "coupons" collection...');
            await pb.collections.create({
                name: 'coupons',
                type: 'base',
                system: false,
                schema: [
                    { name: 'code', type: 'text', required: true, unique: true },
                    { name: 'discount_type', type: 'select', options: { maxSelect: 1, values: ['percentage', 'fixed'] } },
                    { name: 'discount_value', type: 'number', required: true },
                    { name: 'min_order_value', type: 'number' },
                    { name: 'valid_until', type: 'date' },
                    { name: 'usage_limit', type: 'number' },
                    { name: 'used_count', type: 'number' }
                ],
                listRule, viewRule
            });
            console.log('✅ Created "coupons"');
        }

        // 5. Analytics
        if (!existingNames.includes('analytics')) {
            console.log('Creating "analytics" collection...');
            await pb.collections.create({
                name: 'analytics',
                type: 'base',
                system: false,
                schema: [
                    { name: 'event_type', type: 'text', required: true },
                    { name: 'visitor_id', type: 'text' },
                    { name: 'page_url', type: 'text' }
                ],
                createRule: ""
            });
            console.log('✅ Created "analytics"');
        }

        console.log('🎉 Database Schema Setup Complete!');
    } catch (err) {
        console.error('❌ Setup Error:', err.message);
        if (err.response) {
            console.error('Details:', JSON.stringify(err.response, null, 2));
        }
    }
}

setupDB();
