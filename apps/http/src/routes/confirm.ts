import { Router, type Request, type Response } from "express";
import prisma from "../lib/prisma";
import { confirmTx } from "../lib/solana";
import { confirmSchema } from "../utils/validator";
import { authMiddleware } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.post("/", async (req: Request, res: Response) => {
  try {
    const { fileId, signature } = confirmSchema.parse(req.body);
    await confirmTx(signature);
    await prisma.file.update({ where: { id: fileId }, data: { paid: true } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Confirmation failed",
      details: (error as Error).message,
    });
  }
});

export default router;
