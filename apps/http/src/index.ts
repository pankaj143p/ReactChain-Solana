import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error";
import authRoutes from "./routes/auth";
import uploadRoutes from "./routes/upload";
import confirmRoutes from "./routes/confirm";
import filesRoutes from "./routes/files";
import fileRoutes from "./routes/file";
import deleteRoutes from "./routes/delete";
import proxyRoutes from "./routes/proxy";
import subscriptionRoutes from "./routes/subscription";

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "Pragma",
    "Expires",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  exposedHeaders: ["Content-Disposition"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Increase payload limits for large file uploads
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Add request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/confirm", confirmRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/delete", deleteRoutes);
app.use("/api/proxy", proxyRoutes);
app.use("/api/subscription", subscriptionRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
