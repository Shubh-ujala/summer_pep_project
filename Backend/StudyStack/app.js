const express = require('express');
const cors = require('cors');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
// const chatRoutes = require('./routes/chatRoutes');

const logger = require('./middlewares/logger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const configuredOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URLS]
  .flatMap((value) => (value ? value.split(',') : []))
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('Welcome to the StudyStack API');
});

app.use('/api/courses', courseRoutes);
app.use('/', authRoutes);
// app.use('/api', chatRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;