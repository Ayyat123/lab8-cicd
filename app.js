const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Database connection using environment variable
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tasksdb'
});

app.use(express.json());

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Successfully connected to PostgreSQL database');
    release();
  }
});

// GET all tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET single task
app.get('/tasks/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new task
app.post('/tasks', async (req, res) => {
  try {
    const { name, status } = req.body;
    const result = await pool.query(
      'INSERT INTO tasks (name, status) VALUES ($1, $2) RETURNING *',
      [name, status || 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`);
});
