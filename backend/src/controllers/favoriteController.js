const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.toggleFavorite = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.userId;

        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });

        if (existingFavorite) {
            await prisma.favorite.delete({
                where: {
                    id: existingFavorite.id,
                },
            });
            res.json({ message: 'Removed from favorites', isFavorite: false });
        } else {
            await prisma.favorite.create({
                data: {
                    userId,
                    productId,
                },
            });
            res.json({ message: 'Added to favorites', isFavorite: true });
        }
    } catch (error) {
        console.error('Toggle favorite error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const userId = req.user.userId;
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                product: true,
            },
        });

        // Return just the products
        const favoriteProducts = favorites.map(fav => fav.product);
        res.json(favoriteProducts);
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
