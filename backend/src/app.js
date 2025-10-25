const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');
const claimsRoutes = require('./routes/claims');
const adminRoutes = require('./routes/admin');

const app = express();

// Configure helmet but allow serving uploaded images to be used cross-origin
// by setting Cross-Origin-Resource-Policy to 'cross-origin'.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/claims', claimsRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
