const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Users
    const password = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.upsert({
        where: { email: 'user1@example.com' },
        update: {},
        create: {
            email: 'user1@example.com',
            name: 'Alice Johnson',
            password,
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'user2@example.com' },
        update: {},
        create: {
            email: 'user2@example.com',
            name: 'Bob Smith',
            password,
        },
    });

    console.log({ user1, user2 });

    // Create Products
    const productsData = [
        {
            title: 'Vintage Film Camera',
            description: 'A classic 35mm film camera for photography enthusiasts. Perfect for capturing timeless moments with a distinct grain and aesthetic.',
            price: 12999.00,
            imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            title: 'Premium Leather Backpack',
            description: 'Handcrafted from full-grain leather, this backpack allows you to commute in style. Features a laptop compartment and multiple pockets.',
            price: 8499.00,
            imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            title: 'Wireless Noise-Cancelling Headphones',
            description: 'Immerse yourself in music with active noise cancellation. 30-hour battery life and plush ear cushions for all-day comfort.',
            price: 15999.00,
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            title: 'Fitness Smart Watch',
            description: 'Track your health, workouts, and sleep. Receive notifications and control music right from your wrist. Water-resistant.',
            price: 4999.00,
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            title: 'Mechanical Gaming Keyboard',
            description: 'RGB backlit mechanical keyboard with blue switches. Tactile feedback and durability for both gaming and typing.',
            price: 3499.00,
            imageUrl: 'https://images.unsplash.com/photo-1587829742151-09a3d4ad0867?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            title: 'Potted Succulent Plant',
            description: 'Low-maintenance indoor plant in a ceramic pot. Adds a touch of greenery and calm to your workspace or home.',
            price: 499.00,
            imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            title: 'Handcrafted Ceramic Mug',
            description: 'Artisanal ceramic mug with a unique glaze. Perfect for your morning coffee or tea. Microwave and dishwasher safe.',
            price: 899.00,
            imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            title: 'Modern LED Desk Lamp',
            description: 'Sleek and adjustable LED lamp with touch controls. Adjustable brightness and color temperature for reading.',
            price: 1999.00,
            imageUrl: 'https://images.unsplash.com/photo-1507473888900-52e1ad154382?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            title: 'Eco-Friendly Yoga Mat',
            description: 'Non-slip natural rubber yoga mat. Provides excellent cushion and grip for your practice. Biodegradable.',
            price: 2499.00,
            imageUrl: 'https://images.unsplash.com/photo-1592432678010-c5a1c220f165?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            title: 'Classic Aviator Sunglasses',
            description: 'Timeless style with UV400 protection. Metal frame and polarized lenses to reduce glare.',
            price: 1499.00,
            imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            title: 'Running Shoes',
            description: 'Lightweight and breathable running shoes with responsive cushioning. Designed for comfort and performance.',
            price: 3999.00,
            imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            title: 'Smart Home Speaker',
            description: 'Voice-controlled smart speaker with high-quality sound. Control your smart home devices and get answers instantly.',
            price: 4499.00,
            imageUrl: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        }
    ];

    for (const product of productsData) {
        await prisma.product.create({
            data: product,
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
