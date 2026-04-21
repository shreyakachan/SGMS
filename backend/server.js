require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// ─── DATABASE ─────────────────────────────────────────────────────────────────
connectDB();

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/studentAuth'));
app.use('/api/admin',      require('./routes/adminAuth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/reports', require('./routes/reportRoutes'));

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'SGMS Elite Backend Running',
    institution: 'SIES GST',
    timestamp: new Date().toISOString()
  });
});

// ─── 404 FALLBACK ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 SGMS Elite Server started on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log(`🏫 Institution: SIES GST\n`);
});
