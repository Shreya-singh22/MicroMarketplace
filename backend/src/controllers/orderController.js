const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.userId;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(orders);
    } catch (error) {
        console.error('Get Orders Error:', error);
        res.status(500).json({ error: 'Failed to fetch order history' });
    }
};
