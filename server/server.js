const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

// Swagger UI endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 60001;

app.use(cors());
app.use(express.json());

// Open a single persistent connection
const db = new sqlite3.Database('./finance.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
  db.run('PRAGMA foreign_keys = ON');
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
    category TEXT NOT NULL,
    date TEXT DEFAULT (datetime('now'))
  )`);
});

/**
 * @openapi
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
// GET all transactions
app.get('/api/transactions', (req, res) => {
  db.all('SELECT * FROM transactions ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/**
 * @openapi
 * /api/transactions:
 *   post:
 *     summary: Add a new transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       201:
 *         description: Transaction created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 */
// POST add transaction
app.post('/api/transactions', (req, res) => {
  const { description, amount, type, category } = req.body;
  if (!description || amount === undefined || !type || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.run(
    'INSERT INTO transactions (description, amount, type, category) VALUES (?, ?, ?, ?)',
    [description, parseFloat(amount), type, category],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM transactions WHERE id = ?', [this.lastID], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(row);
      });
    }
  );
});

/**
 * @openapi
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       200:
 *         description: Transaction updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 */
// UPDATE transaction
app.put('/api/transactions/:id', (req, res) => {
  console.log('PUT /api/transactions/:id called', req.params.id, req.body);
  const { id } = req.params;
  const { description, amount, type, category } = req.body;
  if (!description || amount === undefined || !type || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.run(
    'UPDATE transactions SET description = ?, amount = ?, type = ?, category = ? WHERE id = ?',
    [description, parseFloat(amount), type, category, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
      });
    }
  );
});

/**
 * @openapi
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: integer
 */
// DELETE transaction
app.delete('/api/transactions/:id', (req, res) => {
  db.run('DELETE FROM transactions WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

/**
 * @openapi
 * /api/summary:
 *   get:
 *     summary: Get financial summary
 *     responses:
 *       200:
 *         description: Summary object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIncome:
 *                   type: number
 *                 totalExpenses:
 *                   type: number
 *                 balance:
 *                   type: number
 */
// GET summary
app.get('/api/summary', (req, res) => {
  db.get(
    `SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpenses,
      (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) as balance
    FROM transactions`,
    [],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        totalIncome: row.totalIncome || 0,
        totalExpenses: row.totalExpenses || 0,
        balance: row.balance || 0,
      });
    }
  );
});

// Close connection on exit
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Closed database connection.');
    }
    process.exit(0);
  });
});






// Handle database errors
db.on('error', (err) => {
  console.error('Database error:', err);
});

// Close the database connection when the process is terminated
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

/**
 * @openapi
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         description:
 *           type: string
 *         amount:
 *           type: number
 *         type:
 *           type: string
 *           enum: [income, expense]
 *         category:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *     TransactionInput:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         amount:
 *           type: number
 *         type:
 *           type: string
 *           enum: [income, expense]
 *         category:
 *           type: string
 */
// API Routes
// Get all transactions
app.get('/api/transactions', (req, res) => {
  const query = 'SELECT * FROM transactions ORDER BY date DESC';
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json(rows);
  });
});

// Add new transaction
app.post('/api/transactions', (req, res) => {
  const { description, amount, type, category } = req.body;
  
  if (!description || amount === undefined || !type || !category) {
    return res.status(400).json({"error": "Missing required fields"});
  }
  
  const query = 'INSERT INTO transactions (description, amount, type, category) VALUES (?, ?, ?, ?)';
  
  db.serialize(() => {
    const stmt = db.prepare(query);
    stmt.run([description, parseFloat(amount), type, category], function(err) {
      stmt.finalize();
      
      if (err) {
        console.error('Error adding transaction:', err);
        return res.status(500).json({"error": err.message});
      }
      
      // Get the inserted transaction
      db.get('SELECT * FROM transactions WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          console.error('Error fetching new transaction:', err);
          return res.status(500).json({"error": err.message});
        }
        res.status(201).json(row);
      });
    });
  });
});

// Delete transaction
app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM transactions WHERE id = ?', id, function(err) {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({ message: 'Transaction deleted', changes: this.changes });
  });
});

// Get summary
app.get('/api/summary', (req, res) => {
  const query = `
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpenses,
      (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
       SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) as balance
    FROM transactions`;
  
  db.get(query, [], (err, row) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json(row);
  });
});

// Start server
console.log('About to call app.listen (single instance)');
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
server.on('error', (err) => {
  console.error('Express server error event:', err);
});

// Handle process termination
// db.close(); // Removed: do not close DB at startup, only on SIGINT
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
    process.exit(0);
  });
});
