
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

app.use(express.static('.'));
app.post('/upload', upload.array('screenshots', 5), (req, res) => {
  if (!req.files || req.files.length !== 5) {
    return res.status(400).json({ error: 'يجب رفع ٥ صور فقط.' });
  }

  // Generate random ID
  const id = 'AIB-' + Math.floor(10000 + Math.random() * 90000);
  const timestamp = new Date().toISOString();
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Save to CSV file
  const logLine = `${id},${timestamp},${ip}\n`;
  fs.appendFileSync('data.csv', logLine);

  // Remove uploaded files after check (if you want to keep them, comment this)
  req.files.forEach(file => fs.unlinkSync(file.path));

  res.json({ id });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
