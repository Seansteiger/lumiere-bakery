import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');

async function updateSchemas() {
    try {
        await pb.admins.authWithPassword('nsdsekatane@gmail.com', '2026Bakery.');
        console.log('✅ Logged in to update schemas');

        // 1. Update Categories
        const cats = await pb.collections.getOne('categories');
        const catFields = [
            ...cats.fields.filter(f => f.system), // keep id, created, updated
            { name: 'name', type: 'text', required: true },
            { name: 'slug', type: 'text', required: true },
            { name: 'description', type: 'text' },
            { name: 'image', type: 'url' }
        ];
        await pb.collections.update(cats.id, { fields: catFields });
        console.log('✅ Categories schema updated');

        // 2. Update Products
        const prods = await pb.collections.getOne('products');
        const prodFields = [
            ...prods.fields.filter(f => f.system),
            { name: 'name', type: 'text', required: true },
            { name: 'slug', type: 'text', required: true },
            { name: 'description', type: 'text' },
            { name: 'price', type: 'number', required: true },
            { name: 'promo_price', type: 'number' },
            { name: 'category', type: 'text' },
            { name: 'image', type: 'url' },
            { name: 'in_stock', type: 'bool' },
            { name: 'is_hot', type: 'bool' },
            { name: 'rating', type: 'number' }
        ];
        await pb.collections.update(prods.id, { fields: prodFields });
        console.log('✅ Products schema updated');

        // 3. Update Orders
        const orders = await pb.collections.getOne('orders');
        const orderFields = [
            ...orders.fields.filter(f => f.system),
            { name: 'user_email', type: 'email' },
            { name: 'customer_name', type: 'text', required: true },
            { name: 'items', type: 'json', required: true },
            { name: 'total', type: 'number', required: true },
            { name: 'fulfillment', type: 'text' },
            { name: 'status', type: 'text' },
            { name: 'booking_date', type: 'date' },
            { name: 'booking_time', type: 'text' },
            { name: 'payment_status', type: 'text' },
            { name: 'payment_method', type: 'text' },
            { name: 'yoco_transaction_id', type: 'text' },
            { name: 'guest_count', type: 'number' },
            { name: 'event_type', type: 'text' }
        ];
        await pb.collections.update(orders.id, {
            fields: orderFields,
            createRule: "", // Allow anyone to create an order
            updateRule: "@request.auth.id != ''", // Only auth users can update
            viewRule: "@request.auth.id != ''" // Only auth users can view
        });
        console.log('✅ Orders schema updated');

        // 4. Setup Users collection rules for registration
        const users = await pb.collections.getOne('users');
        const userFields = [
            ...users.fields.filter(f => f.system),
            { name: 'name', type: 'text' },
            { name: 'avatar', type: 'file' },
            { name: 'phone', type: 'text' }
        ];

        await pb.collections.update(users.id, {
            fields: userFields,
            createRule: "",      // allow public registration
            viewRule: "id = @request.auth.id",
            updateRule: "id = @request.auth.id"
        });
        console.log('✅ Users schema configured');

        console.log('🎉 Schema Upgrade Complete!');
    } catch (err) {
        console.error('❌ Schema Update Error:', err.message);
        if (err.response && err.response.data) {
            console.error('Error Details:', JSON.stringify(err.response.data, null, 2));
        }
    }
}

updateSchemas();
