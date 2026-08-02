const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'news_data.json');

// Helper Function: Data Read karva mate
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ pending: [], approved: [] }));
  }
  const fileData = fs.readFileSync(DATA_FILE);
  return JSON.parse(fileData);
};

// Helper Function: Data Write karva mate
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// 1️⃣ Submit News API (User side thi)
app.post('/api/submit-news', (req, res) => {
  const { title, category, author, image, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description required' });
  }

  const data = readData();
  const newRequest = {
    id: Date.now(),
    title,
    category: category || 'general',
    author: author || 'Anonymous',
    image,
    description,
    status: 'pending',
    date: new Date().toLocaleDateString()
  };

  data.pending.push(newRequest);
  writeData(data);

  res.status(201).json({ message: 'News submitted for approval', news: newRequest });
});

// 2️⃣ Pending News List API (Admin Panel mate)
app.get('/api/pending-news', (req, res) => {
  const data = readData();
  res.json(data.pending);
});

// 3️⃣ Approve News API (Admin Approve kare tyare)
app.post('/api/approve-news/:id', (req, res) => {
  const newsId = Number(req.params.id);
  const data = readData();
  const newsIndex = data.pending.findIndex(item => item.id === newsId);

  if (newsIndex === -1) {
    return res.status(404).json({ error: 'News request not found' });
  }

  const approvedItem = data.pending.splice(newsIndex, 1)[0];
  approvedItem.status = 'approved';
  data.approved.unshift(approvedItem); // Top par add thase

  writeData(data);
  res.json({ message: 'News approved successfully!', news: approvedItem });
});

// 4️⃣ Reject News API (Admin Reject kare tyare)
app.delete('/api/reject-news/:id', (req, res) => {
  const newsId = Number(req.params.id);
  const data = readData();
  data.pending = data.pending.filter(item => item.id !== newsId);
  writeData(data);
  res.json({ message: 'News rejected' });
});

// 5️⃣ Approved User News API (Live Feed mate)
app.get('/api/user-news', (req, res) => {
  const data = readData();
  res.json(data.approved);
});

// 6️⃣ Delete Approved Live News API
app.delete('/api/delete-news/:id', (req, res) => {
  const newsId = Number(req.params.id);
  const data = readData();
  data.approved = data.approved.filter(item => item.id !== newsId);
  writeData(data);
  res.json({ message: 'Live news deleted successfully!' });
});

const PORT = 5000;

// Root Route (Cannot GET / ne fix karva mate)
// Root Route (Cannot GET / fix karva mate)
// Root Route (Cannot GET / fix karva mate)
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
      <h1>🚀 G-News Express Backend API Server Running!</h1>
      <p>All REST API endpoints are active on <b>http://localhost:5000/api/...</b></p>
    </div>
  `);
});
app.listen(PORT, () => console.log(`🚀 Express Server running on http://localhost:${PORT}`));