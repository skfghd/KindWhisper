import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { translateRoutes } from "./routes/translate";
import { usageRoutes } from "./routes/usage";
import { validateEnvironmentSecurity } from "./middleware/security";

// Initialize Firebase Admin
admin.initializeApp();

// Validate environment security
validateEnvironmentSecurity();

// Create Express app
const app = express();

// Configure CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/translate', translateRoutes);
app.use('/api/usage', usageRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Export the Express app as a Firebase Function
export const api = functions.region('asia-northeast3').https.onRequest(app);