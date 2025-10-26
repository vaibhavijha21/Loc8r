const express = require('express');
const pool = require('../db');
const { hashPassword, comparePassword, createToken } = require('../utils/auth');
const { authMiddleware, adminOnly } = require('../middlewares/auth');
const router = express.Router();

// Admin register (if you want an endpoint; else seed admin via SQL)
router.post('/register', async (req, res) => {
  try {
    const { Admin_Name, Email, password } = req.body;
    if (!Email || !password) return res.status(400).json({ message: 'Email & password required' });
    const [exists] = await pool.query('SELECT AdminID FROM Admins WHERE Email = ?', [Email]);
    if (exists.length) return res.status(400).json({ message: 'Email already exists' });
    const hashed = await hashPassword(password);
    const [r] = await pool.query('INSERT INTO Admins (Admin_Name, Email, Password_hash) VALUES (?, ?, ?)', [Admin_Name || null, Email, hashed]);

    // create token and return admin info (mirror user register behavior)
    const admin = { id: r.insertId, name: Admin_Name, email: Email, role: 'admin' };
    const token = createToken({ id: admin.id, role: admin.role });
    res.json({ admin, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { Email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM Admins WHERE Email=?', [Email]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid creds' });
    const admin = rows[0];
    const ok = await comparePassword(password, admin.Password_hash);
    if (!ok) return res.status(400).json({ message: 'Invalid creds' });
    const token = createToken({ id: admin.AdminID, role: 'admin' });
    res.json({ token, admin: { id: admin.AdminID, name: admin.Admin_Name, email: admin.Email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// Admin: list pending claims
router.get('/claims/pending', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, u.User_name AS claimer_name, f.FoundID, i.Item_name
      FROM claim c
      JOIN Users u ON c.UserID = u.UserID
      JOIN FoundItem f ON c.FoundID = f.FoundID
      JOIN Item i ON f.ItemID = i.ItemID
      WHERE c.Claim_status = 'Pending'
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// 📊 Admin Analytics
router.get("/analytics", async (req, res) => {
  try {
    const [lostCount] = await db.query("SELECT COUNT(*) AS count FROM LostItem");
    const [foundCount] = await db.query("SELECT COUNT(*) AS count FROM FoundItem");
    const [claims] = await db.query("SELECT COUNT(*) AS count FROM claim");
    const [approvedClaims] = await db.query(
      "SELECT COUNT(*) AS count FROM claim WHERE status='approved'"
    );
    const [rejectedClaims] = await db.query(
      "SELECT COUNT(*) AS count FROM claim WHERE status='rejected'"
    );
    const [history] = await db.query("SELECT COUNT(*) AS count FROM HistoryRecord");

    res.json({
      lostItems: lostCount[0].count,
      foundItems: foundCount[0].count,
      totalClaims: claims[0].count,
      approvedClaims: approvedClaims[0].count,
      rejectedClaims: rejectedClaims[0].count,
      returnedItems: history[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});


module.exports = router;
