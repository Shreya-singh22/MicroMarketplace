const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const favoriteRoutes = require('./routes/favorites');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Micro Marketplace API is running');
});

// Create routes files if they don't exist yet to avoid crash
// Actually I'll create dummy files first to avoid crash

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
