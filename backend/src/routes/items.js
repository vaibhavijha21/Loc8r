const express = require('express');
const pool = require('../db');
const upload = require('../middlewares/upload');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

/**
 * Create item (lost or found)
 * multipart/form-data:
 *  fields:
 *   Item_name, Item_description, Item_status ('lost'|'found'),
 *   Lost_Date (optional), PossibleLocation (optional) -- for lost
 *   Reported_Date (optional), Location (optional) -- for found
 *  files: images[]
 */
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { Item_name, Item_description, Item_status, Lost_Date, PossibleLocation, Reported_Date, Location } = req.body;
    const userId = req.user.id;
    if (!Item_name || !Item_status) return res.status(400).json({ message: 'Item_name and Item_status required' });
    if (!['lost','found'].includes(Item_status)) return res.status(400).json({ message: 'Invalid Item_status' });

    // insert item
    const [itemRes] = await pool.query('INSERT INTO Item (Item_name, Item_description, Item_status) VALUES (?, ?, ?)', [Item_name, Item_description || '', Item_status]);
    const itemId = itemRes.insertId;

    // insert into LostItem or FoundItem
    if (Item_status === 'lost') {
      await pool.query('INSERT INTO LostItem (ItemID, UserID, Lost_Date, PossibleLocation) VALUES (?, ?, ?, ?)', [itemId, userId, Lost_Date || new Date(), PossibleLocation || null]);
      // optional images: tie to ItemID
      if (req.files && req.files.length) {
        const vals = req.files.map(f => [itemId, null, `/uploads/${f.filename}`]);
        await pool.query('INSERT INTO Images (ItemID, FoundID, Url) VALUES ?', [vals]);
      }
    } else { // found
      const [foundRes] = await pool.query('INSERT INTO FoundItem (ItemID, UserID, Reported_Date, Location) VALUES (?, ?, ?, ?)', [itemId, userId, Reported_Date || new Date(), Location || null]);
      const foundId = foundRes.insertId;
      if (req.files && req.files.length) {
        const vals = req.files.map(f => [itemId, foundId, `/uploads/${f.filename}`]);
        await pool.query('INSERT INTO Images (ItemID, FoundID, Url) VALUES ?', [vals]);
      }
    }

    res.status(201).json({ message: 'Item recorded', itemId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// List items (joined with lost/found info and poster name/email)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        i.ItemID, 
        i.Item_name, 
        i.Item_description, 
        i.Item_status,
        l.LostID, 
        l.Lost_Date, 
        l.PossibleLocation,
        f.FoundID, 
        f.Reported_Date, 
        f.Location,
        -- first image as thumbnail
        (SELECT Url FROM Images im WHERE im.ItemID = i.ItemID LIMIT 1) AS ThumbUrl,
        -- name & email of the user who posted this item
        CASE 
          WHEN i.Item_status = 'lost' THEN ul.User_name
          WHEN i.Item_status = 'found' THEN uf.User_name
          ELSE NULL
        END AS PosterName,
        CASE 
          WHEN i.Item_status = 'lost' THEN ul.Email
          WHEN i.Item_status = 'found' THEN uf.Email
          ELSE NULL
        END AS PosterEmail
      FROM Item i
      LEFT JOIN LostItem l ON i.ItemID = l.ItemID
      LEFT JOIN Users ul ON l.UserID = ul.UserID
      LEFT JOIN FoundItem f ON i.ItemID = f.ItemID
      LEFT JOIN Users uf ON f.UserID = uf.UserID
      WHERE (f.Status IS NULL OR f.Status <> 'Returned')
      ORDER BY i.ItemID DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single item details (images + claims)
router.get('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const [items] = await pool.query('SELECT * FROM Item WHERE ItemID=?', [itemId]);
    if (!items.length) return res.status(404).json({ message: 'Item not found' });
    const item = items[0];

    const [lost] = await pool.query('SELECT * FROM LostItem WHERE ItemID=?', [itemId]);
    const [found] = await pool.query('SELECT * FROM FoundItem WHERE ItemID=?', [itemId]);
    const [images] = await pool.query('SELECT * FROM Images WHERE ItemID=? OR FoundID IN (SELECT FoundID FROM FoundItem WHERE ItemID=?)', [itemId, itemId]);
    const [claims] = await pool.query(`
      SELECT c.*, u.User_name, u.Email
      FROM claim c
      JOIN Users u ON c.UserID = u.UserID
      WHERE c.FoundID IN (SELECT FoundID FROM FoundItem WHERE ItemID=?)
    `, [itemId]);

    res.json({ item, lost: lost[0] || null, found: found[0] || null, images, claims });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔍 Search & Filter Items
router.get("/search", async (req, res) => {
  const { q, status, category } = req.query; // e.g. ?q=wallet&status=lost
  let query = "SELECT * FROM Item WHERE 1=1";
  const params = [];

  if (q) {
    query += " AND Item_name LIKE ?";
    params.push(`%${q}%`);
  }

  if (status) {
    query += " AND Item_status = ?";
    params.push(status);
  }

  if (category) {
    query += " AND Item_category = ?";
    params.push(category);
  }

  try {
    const [rows] = await pool.query(query, params); // <-- use 'pool' here
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
});


module.exports = router;
