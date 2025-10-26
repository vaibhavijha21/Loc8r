const express = require('express');
const pool = require('../db');
const { hashPassword, comparePassword, createToken } = require('../utils/auth');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();



// Register
router.post('/register', async (req, res) => {
  try {
    const { User_name, Contact, Email, User_Department, password } = req.body;
    if (!Email || !password) return res.status(400).json({ message: 'Email and password required' });

    const [rows] = await pool.query('SELECT UserID FROM Users WHERE Email=?', [Email]);
    if (rows.length) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await hashPassword(password);
    const [result] = await pool.query(
      'INSERT INTO Users (User_name, Contact, Email, User_Department, Password_hash) VALUES (?, ?, ?, ?, ?)',
      [User_name || null, Contact || '', Email, User_Department || null, hashed]
    );

    const user = { id: result.insertId, name: User_name, email: Email, role: 'user' };
    const token = createToken({ id: user.id, role: user.role });
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
// router.post('/login', async (req, res) => {
//   try {
//     const { Email, password } = req.body;
//     if (!Email || !password) return res.status(400).json({ message: 'Email and password required' });

//     const [rows] = await pool.query('SELECT * FROM Users WHERE Email=?', [Email]);
//     if (!rows.length) return res.status(400).json({ message: 'Invalid credentials' });

//     const user = rows[0];
//     const ok = await comparePassword(password, user.Password_hash);
//     if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = createToken({ id: user.UserID, role: 'user' });
//     res.json({ user: { id: user.UserID, name: user.User_name, email: user.Email }, token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// Login
router.post('/login', async (req, res) => {
  try {
    const { Email, password } = req.body;

    if (!Email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const [rows] = await pool.query('SELECT * FROM Users WHERE Email=?', [Email]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const ok = await comparePassword(password, user.Password_hash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = createToken({ id: user.UserID, role: 'user' });

    // 👇 Added phone field to response
    res.json({
      user: {
        id: user.UserID,
        name: user.User_name,
        email: user.Email,
        Contact: user.Contact,   // <-- ✅ Add this line
        role: user.Role      // optional, if you have roles
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// GET user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT UserID, username, email, phone, role FROM Users WHERE UserID = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});




module.exports = router;
