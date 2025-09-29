import { Router, type Request, type Response } from "express";
import multer from "multer";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";
import { getPlanByTier } from "../lib/subscription";
import { addToIPFS } from "../lib/ipfs";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
});

// Upload file endpoint
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const pubKey = req.user!.pubKey;
      const user = await prisma.user.findUnique({
        where: { pubKey },
        include: {
          subscriptions: {
            where: { active: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get current subscription and storage limits
      const currentSubscription = user.subscriptions[0];
      const tier = currentSubscription?.tier || "free";
      const plan = getPlanByTier(tier);

      // Calculate current storage usage
      const files = await prisma.file.findMany({
        where: { userId: user.id, deleted: false },
        select: { size: true },
      });

      const currentUsage = files.reduce(
        (total, file) => total + file.size,
        BigInt(0)
      );
      const newFileSize = BigInt(req.file.size);
      const totalAfterUpload = currentUsage + newFileSize;

      // Check storage limits
      if (totalAfterUpload > plan.storageLimit) {
        return res.status(413).json({
          error: "Storage limit exceeded",
          currentUsage: currentUsage.toString(),
          limit: plan.storageLimit.toString(),
          fileSize: newFileSize.toString(),
          tier,
        });
      }

      // Upload to IPFS
      const cid = await addToIPFS(req.file.buffer, req.file.originalname);

      // Save file metadata to database (no payment required)
      const file = await prisma.file.create({
        data: {
          userId: user.id,
          fileName: req.file.originalname,
          cid,
          size: newFileSize,
          paid: true, // Auto-approve since no payment required
          timestamp: new Date(),
          mimetype: req.file.mimetype, // Save mimetype
        },
      });

      res.json({
        success: true,
        file: {
          id: file.id,
          fileName: file.fileName,
          cid: file.cid,
          size: file.size.toString(),
          timestamp: file.timestamp,
        },
        storageUsed: totalAfterUpload.toString(),
        storageLimit: plan.storageLimit.toString(),
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        error: "Upload failed",
        details: (error as Error).message,
      });
    }
  }
);

export default router;
