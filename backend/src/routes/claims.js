const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

// Submit a claim for a found item
router.post('/:foundId', authMiddleware, async (req, res) => {
  try {
    const { foundId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    // check found exists
    const [fRows] = await pool.query('SELECT * FROM FoundItem WHERE FoundID=?', [foundId]);
    if (!fRows.length) return res.status(404).json({ message: 'Found item not found' });

    // Try to persist message if column exists; fallback to insert without message
    try {
      await pool.query(
        'INSERT INTO claim (UserID, FoundID, Claim_date, Claim_status, Message) VALUES (?, ?, NOW(), ?, ?)',
        [userId, foundId, 'Pending', message || null]
      );
    } catch (e) {
      // If Message column does not exist, insert without it
      await pool.query(
        'INSERT INTO claim (UserID, FoundID, Claim_date, Claim_status) VALUES (?, ?, NOW(), ?)',
        [userId, foundId, 'Pending']
      );
    }

    res.json({ message: 'Claim submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/reject claim (admin)
router.post('/:claimId/action', authMiddleware, async (req, res) => {
  try {
    const { claimId } = req.params;
    const { action } = req.body;
    if (!['approve','reject'].includes(action)) return res.status(400).json({ message: 'Invalid action' });

    // Only admin allowed currently
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

    const status = action === 'approve' ? 'Approved' : 'Rejected';
    await pool.query('UPDATE claim SET Claim_status=?, Claim_date=NOW() WHERE ClaimID=?', [status, claimId]);

    if (status === 'Approved') {
      const [[claimRow]] = await pool.query('SELECT * FROM claim WHERE ClaimID=?', [claimId]);
      if (claimRow) {
        const { UserID, FoundID } = claimRow;
        await pool.query('INSERT INTO HistoryRecord (UserID, FoundID, Return_date) VALUES (?, ?, NOW())', [UserID, FoundID]);
      }
    }

    res.json({ message: `Claim ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
