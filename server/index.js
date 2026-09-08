import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'AI RESCUEFLOW SHADOW',
    mode: 'DETERMINISTIC_PHYSICS_ENGINE',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend assets if built
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) {
        res.status(200).send('AI RESCUEFLOW SHADOW Server active. Start Vite dev server on port 5173 for development.');
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AI RESCUEFLOW SHADOW Backend running on http://localhost:${PORT}`);
});
