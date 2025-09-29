import { Router, type Request, type Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: Request, res: Response) => {
  try {
    const pubKey = req.user!.pubKey;
    const { count } = req.query;
    const user = await prisma.user.findUnique({ where: { pubKey } });
    if (!user) {
      return res.json(count ? { count: 0 } : { files: [] });
    }
    if (count === "true") {
      const fileCount = await prisma.file.count({
        where: { userId: user.id, paid: true, deleted: false },
      });
      return res.json({ count: fileCount });
    }
    const files = await prisma.file.findMany({
      where: { userId: user.id, paid: true, deleted: false },
      orderBy: { timestamp: "desc" },
      take: 10,
    });
    res.json({
      files: files.map((file) => ({
        ...file,
        size: file.size !== undefined ? file.size.toString() : undefined,
      })),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Query failed", details: (error as Error).message });
  }
});

export default router;
