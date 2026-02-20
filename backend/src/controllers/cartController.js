const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId, items: { create: [] } },
                include: { items: { include: { product: true } } }
            });
        }
        res.json(cart);
    } catch (error) {
        console.error('Get Cart Error:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        // Ensure cart exists
        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }

        // Upsert cart item
        const item = await prisma.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: parseInt(productId)
                }
            },
            update: {
                quantity: { increment: parseInt(quantity) }
            },
            create: {
                cartId: cart.id,
                productId: parseInt(productId),
                quantity: parseInt(quantity)
            },
            include: { product: true }
        });

        res.json(item);
    } catch (error) {
        console.error('Add to Cart Error:', error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.userId;

    if (quantity < 1) {
        return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    try {
        // Verify item belongs to user's cart
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true }
        });

        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        const item = cart.items.find(i => i.id === parseInt(itemId));
        if (!item) return res.status(404).json({ error: 'Item not found in cart' });

        const updatedItem = await prisma.cartItem.update({
            where: { id: parseInt(itemId) },
            data: { quantity: parseInt(quantity) },
            include: { product: true }
        });

        res.json(updatedItem);
    } catch (error) {
        console.error('Update Cart Item Error:', error);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.userId;

    try {
        // Verify item belongs to user's cart to prevent unauthorized deletion
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        // Check if item exists in this cart (optional security check, Prisma will fail if ID doesn't exist)
        // A direct delete with where clause is simpler but we should ensure it's in the correct cart
        // However, standard implementation usually creates a secure query.
        // Let's rely on Prisma where clause with cartId if possible, but CartItem delete by ID is global.
        // Better: ensure the item being deleted belongs to the user's cart.

        const item = await prisma.cartItem.findUnique({ where: { id: parseInt(itemId) } });
        if (!item || item.cartId !== cart.id) {
            return res.status(404).json({ error: 'Item not found or unauthorized' });
        }

        await prisma.cartItem.delete({
            where: { id: parseInt(itemId) }
        });

        res.json({ message: 'Item removed' });
    } catch (error) {
        console.error('Remove Cart Item Error:', error);
        res.status(500).json({ error: 'Failed to remove item' });
    }
};

// Checkout (Create Order and Clear Cart)
exports.checkout = async (req, res) => {
    const userId = req.user.userId;
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Calculate total amount
        const totalAmount = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        // Create Order and OrderItems in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // 1. Create the order
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    status: 'COMPLETED',
                    items: {
                        create: cart.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price
                        }))
                    }
                },
                include: {
                    items: true
                }
            });

            // 2. Clear the cart
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            });

            return newOrder;
        });

        res.json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Checkout Error:', error);
        res.status(500).json({ error: 'Failed to process checkout' });
    }
};
