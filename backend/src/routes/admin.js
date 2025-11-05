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

// Admin: list all claims
router.get('/claims', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, u.User_name AS claimer_name, f.FoundID, i.Item_name
      FROM claim c
      JOIN Users u ON c.UserID = u.UserID
      JOIN FoundItem f ON c.FoundID = f.FoundID
      JOIN Item i ON f.ItemID = i.ItemID
      ORDER BY c.ClaimID DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// 📊 Admin Analytics
router.get("/analytics", authMiddleware, adminOnly, async (req, res) => {
  try {
    const [lostCount] = await pool.query("SELECT COUNT(*) AS count FROM LostItem");
    const [foundCount] = await pool.query("SELECT COUNT(*) AS count FROM FoundItem");
    const [userCount] = await pool.query("SELECT COUNT(*) AS count FROM Users");
    const [claims] = await pool.query("SELECT COUNT(*) AS count FROM claim");
    const [approvedClaims] = await pool.query(
      "SELECT COUNT(*) AS count FROM claim WHERE Claim_status='Approved'"
    );
    const [rejectedClaims] = await pool.query(
      "SELECT COUNT(*) AS count FROM claim WHERE Claim_status='Rejected'"
    );
    const [history] = await pool.query("SELECT COUNT(*) AS count FROM HistoryRecord");

    res.json({
      lostItems: lostCount[0].count,
      foundItems: foundCount[0].count,
      totalUsers: userCount[0].count,
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

// Get all users
router.get("/users", authMiddleware, adminOnly, async (req, res) => {
  try {
      const [users] = await pool.query(`
        SELECT UserID, User_name, Email
        FROM Users
        ORDER BY UserID DESC
      `);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Update claim status
router.put("/claims/:claimId/status", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status } = req.body;
    
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await pool.query(
      'UPDATE claim SET Claim_status = ?, Updated_at = NOW() WHERE ClaimID = ?',
      [status, claimId]
    );

    // If approved, update item status and create history record
    if (status === 'Approved') {
      const [claim] = await pool.query(
        'SELECT FoundID, UserID FROM claim WHERE ClaimID = ?',
        [claimId]
      );
      
      if (claim.length > 0) {
        // Create history record
        await pool.query(
          'INSERT INTO HistoryRecord (ClaimID, FoundID, UserID, Status) VALUES (?, ?, ?, "Returned")',
          [claimId, claim[0].FoundID, claim[0].UserID]
        );

        // Update found item status
        await pool.query(
          'UPDATE FoundItem SET Status = "Returned" WHERE FoundID = ?',
          [claim[0].FoundID]
        );
      }
    }

    res.json({ message: 'Claim status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update claim status' });
  }
});

// Get all items (lost and found)
router.get("/items", authMiddleware, adminOnly, async (req, res) => {
  try {
    const [items] = await pool.query(`
      SELECT 
        i.ItemID,
        i.Item_name,
        CASE 
          WHEN l.LostID IS NOT NULL THEN 'Lost'
          WHEN f.FoundID IS NOT NULL THEN 'Found'
        END as Type,
        c.Claim_status as ItemStatus,
        f.Status as FoundStatus,
        u.User_name as Reporter
      FROM Item i
      LEFT JOIN LostItem l ON i.ItemID = l.ItemID
      LEFT JOIN FoundItem f ON i.ItemID = f.ItemID
      LEFT JOIN claim c ON f.FoundID = c.FoundID
      LEFT JOIN Users u ON COALESCE(l.UserID, f.UserID) = u.UserID
      ORDER BY i.ItemID DESC
    `);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

module.exports = router;
