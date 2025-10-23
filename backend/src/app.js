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

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/claims', claimsRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
