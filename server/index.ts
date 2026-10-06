import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './routes/health';
import analyzeRouter from './routes/analyze';
import aiRouter from './routes/ai';
import compareRouter from './routes/compare';
import analysesRouter from './routes/analyses';
import reportRouter from './routes/report';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.use('/api', healthRouter);

// Main analyzer endpoint
app.use('/api', analyzeRouter);

// AI Chat assistant endpoint
app.use('/api/ai', aiRouter);

// Comparison endpoint
app.use('/api', compareRouter);

// Analyses storage endpoints
app.use('/api', analysesRouter);

// Report endpoints
app.use('/api', reportRouter);

// Root greeting
app.get('/', (_req, res) => {
  res.json({
    service: 'DealWise AI Server',
    status: 'online',
    tagline: 'Know the deal before you buy.',
    endpoints: [
      'GET /api/health',
      'POST /api/analyze',
      'POST /api/ai/chat',
      'POST /api/compare',
      'GET /api/analyses',
      'POST /api/analyses',
      'DELETE /api/analyses/:id',
      'POST /api/report'
    ]
  });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[DealWise AI Server] running on http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
  console.log(`[OpenAI] ${process.env.OPENAI_API_KEY ? 'API key detected' : 'Not configured (using deterministic engine)'}`);
  console.log(`[Supabase] ${process.env.SUPABASE_URL ? 'Credentials detected' : 'Not configured (using memory/local fallback)'}`);
});
