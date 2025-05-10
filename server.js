const express = require('express');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'upload_images'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.array('images', 10), (req, res) => {
  res.json({ message: 'Files uploaded successfully', files: req.files });
});

// MySQL connection (adjust credentials)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'your_database'
});

app.post('/add-user', (req, res) => {
  const { email, password, type } = req.body;
  const sql = `CALL addUser(?, ?, ?);`;
  pool.query(sql, [email, password, type], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User added', results });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));