import { Router, type Request, type Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.delete("/", async (req: Request, res: Response) => {
  try {
    const fileIdRaw = req.query.fileId;
    const fileId = Number(fileIdRaw);
    if (!fileIdRaw || isNaN(fileId)) {
      return res.status(400).json({ error: "Missing or invalid fileId" });
    }
    const pubKey = req.user!.pubKey;
    const user = await prisma.user.findUnique({ where: { pubKey } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file || file.userId !== user.id) {
      return res.status(404).json({ error: "File not found or not owned" });
    }
    await prisma.file.update({
      where: { id: fileId },
      data: { deleted: true },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Delete failed", details: (error as Error).message });
  }
});

export default router;
