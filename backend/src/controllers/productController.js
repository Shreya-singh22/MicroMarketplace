const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllProducts = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const where = search
            ? {
                OR: [
                    { title: { contains: search } }, // SQLite search is case-sensitive by default with Prisma usually, but let's stick to simple contains
                    { description: { contains: search } },
                ],
            }
            : {};

        const products = await prisma.product.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
        });

        const total = await prisma.product.count({ where });

        res.json({
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Get all products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Get product by id error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, imageUrl } = req.body;
        const product = await prisma.product.create({
            data: {
                title,
                description,
                price,
                imageUrl,
            },
        });
        res.status(201).json(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
