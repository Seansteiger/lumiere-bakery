import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');

const categories = [
    { name: 'Artisanal Breads', slug: 'artisanal-breads', description: 'Sourdough, ciabatta, and rye baked fresh every morning.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM_YtY7_XiU3WlTroQCf9J2mZxQbhwqqmvv3Q4kAtzrM1x8Y6b7-2iUpW0CGM85gbbdQHsCT262RlwqbCH6UAqXgA8QuoVzstC0To2Agikuocomj5kNHOibCusS6KdoQaJ0Mx7QtriXHRI_8cq9jwgMETVrK436xXGTtW_ExSx2DZiZVJ07f_rLuoI2ZW27zpc7WgsdcL5LGasGJoDa-uG9ymssybJzJfNnibY2GddKSpJ7fPCPfNhDLe06Ghhm3_Y9uRjw9CrXpQ' },
    { name: 'Custom Cakes', slug: 'custom-cakes', description: 'Bespoke creations for weddings, birthdays and special events.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIwxHKPYhrq-2bMT5XTugvAPq3oFYHKfylSoPs1l0gCs-SN8SxLD67CcsqPPc3XGZo28faimqetQ3p_UYtRuT_HhAxsAwLZkznQzc2LTydpGYRLPdNm-85RdPn62HKQ4c3ywdmtNpx5tW8V_El1UwZIDEZYCidIjFDVRB51u00SZaFqt0JC6TXiU9yNzhnXNArUlGsAXGWz59SXm6LkF9dVdwDrnnc6xUHdPELhLpA2mzpMEkz9h3MirVIsyie1qKkZyhgh5NHsHc' },
    { name: 'Morning Pastries', slug: 'morning-pastries', description: 'Croissants, danishes, and muffins to start your day right.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCQvd4q5-qL_DgiysjEUELfO81dJSPrJM2HaWMiB531uanEfKuJFfI0bh6vUwwV4bc5HEvBibbz6Flqjsv2Cyuu5r5hsdBFf3fcC0Nb8_UYZdvSkUfD4o84MZ0xNXeSCCx3Qt_RdscCneXJXLqp1S4yocjDAr3vTeWT615x6rzRxnP7k2uZ4SmK-S-vzZpAWoVt7pciZKd3Vszua6249yZoIrJZQiC1h7nrRaldKYP7A2kBo0CTN2DUpriQ8nuIsfjFWr6Z12alqs' }
];

const products = [
    { name: 'Red Velvet Cupcake', slug: 'red-velvet-cupcake', categorySlug: 'custom-cakes', description: 'Cream cheese frosting & crumbs', price: 35.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbdL4-Gn-8GJLsM54DnL_vem6A7EKzhVrHOPP9old65YYFwLc8JB4SXEUdYQiY6GD7pF45uNC3DvqMm_TLSbM_0QfIBfOUrcS-dddHCGiheJEI-TsYKEClLnhasOBfIQL6nTZBghxme2U6yaMsL48Z6zC_QgFwKlxW_ku23xNpyJh3dIb6KlTFKAEueaphw6Zvm-pUG2P9bYrHedQ0JvUxMoBMaaZNsroN1sQm4rY_Di4TqVN3M8M1U1-H_BCh37uLqBwc-Cs4hes', in_stock: true, is_hot: true, rating: 4.8 },
    { name: 'Choc-Chip Cookie', slug: 'choc-chip-cookie', categorySlug: 'morning-pastries', description: 'Gooey center, crispy edges', price: 25.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM3Su45ROtsuGx6NXoNKuDTUcN58kzCuwZbfUOJtwdlMRI4eEfWPISpEhYxgQfyllplgeSZFqNdNfyw6hqvFtPdWRmDo1kebVmWDmzjyPwyd3dn1LHLqcPZD3XqOC4sEuWk5jOSmSH6mxy9vsEmNrugc1190puWvDNdPJqvJQ1QaTFg138a15bRkfX8s0L3noR3VD6EwwuvVk3tzeBtR1Dz5T55v3lvVLvnidQ7sEduxRPZ8dOOdcxEMMfHqWacQnT37l9bC5gBhU', in_stock: true, is_hot: false, rating: 4.9 },
    { name: 'Mixed Berry Tart', slug: 'mixed-berry-tart', categorySlug: 'morning-pastries', description: 'Seasonal berries, vanilla custard', price: 65.00, promo_price: 55.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxjy9bDu-fVV6lUtKmZQ5hEJBswkqOxurr7RGRk95Ch9kIqu2zdOziRuvDu76h0F4O7IPUzAvPa9zypSwY8o3en4WJGzUkz_2PQ7X6Usc30tUNbrkPhsHQ7feFgbspuJfPv_fL71tMuTi3HMMU3XFkQQOKHybidRbE_tUHq-PcOs8evL2xT9K1WSQ957VDgQ5-xXVFFLFnN2iv9gSucmAlpsFHOCWpH0kY0G5ggPZWUK0AqKHj2H8XIefnO9ubHpDSond8yDS08IY', in_stock: true, is_hot: true, rating: 5.0 },
    { name: 'Everything Bagel', slug: 'everything-bagel', categorySlug: 'artisanal-breads', description: 'Toasted sesame & poppy seeds', price: 15.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApjKLfCGeqNkf6b9Vdc_HIePFRAb1FS56NXkFFM4I6F0NgHkoWb9Fy4T67BMM-_sPkSuvzz8sIA0NDBOvxec91PozVE8VCc3Z6OS9nXe5LuUe6gU8mOOmaD3C111ykln-W8Vi9_M17YhDJVlORD0-rRcOLWKRsj7rrI3NfRSHU3P9KjbATZMaPLDIPZcbcDH7cpSw2L3jdfPLupm8TXS9GA_A-lyubV6nqYeh-fefM9BWXNt2Fa87QSsWw-fcL_ymXB2JPrFOLuIA', in_stock: true, is_hot: false, rating: 4.7 }
];

async function seedDB() {
    try {
        await pb.admins.authWithPassword('nsdsekatane@gmail.com', '2026Bakery.');
        console.log('✅ Logged in to seed database');

        const catModels = {};
        for (const cat of categories) {
            try {
                const record = await pb.collection('categories').create(cat);
                catModels[cat.slug] = record.id;
                console.log(`Created category: ${cat.name}`);
            } catch (err) {
                if (err.status === 400 && err.response.data.name?.code === 'validation_not_unique') {
                    console.log(`Category ${cat.name} already exists.`);
                    const existing = await pb.collection('categories').getFirstListItem(`slug="${cat.slug}"`);
                    catModels[cat.slug] = existing.id;
                } else {
                    console.error('Error creating category:', err);
                }
            }
        }

        for (const prod of products) {
            try {
                await pb.collection('products').create({
                    ...prod,
                    category: catModels[prod.categorySlug]
                });
                console.log(`Created product: ${prod.name}`);
            } catch (err) {
                if (err.status === 400 && err.response.data.slug?.code === 'validation_not_unique') {
                    console.log(`Product ${prod.name} already exists.`);
                } else {
                    console.error('Error creating product:', err);
                }
            }
        }

        console.log('🎉 Data Hydration Complete!');
    } catch (err) {
        console.error('❌ Seeding Error:', err.message, err.response);
    }
}

seedDB();
