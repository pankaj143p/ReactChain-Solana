import { Router,type Request,type Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const renameSchema = z.object({
  newName: z.string().min(1),
});

const router = Router();
router.use(authMiddleware);

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.id, 10);
    const { newName } = renameSchema.parse(req.body);
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
      data: { fileName: newName },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Rename failed", details: (error as Error).message });
  }
});

export default router;
