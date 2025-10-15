import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import events from 'events';

// Increase the maximum number of listeners
events.setMaxListeners(20); // Set to a higher value to avoid warnings

// Initialize Express
const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/uploads/resumes', express.static(path.join(process.cwd(), 'uploads', 'resumes')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes); // Ensure this line exists
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Capture unhandled warnings
process.on('warning', (warning) => {
  console.error(`Warning captured: ${warning.name} - ${warning.message}`);
  console.error(warning.stack);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;