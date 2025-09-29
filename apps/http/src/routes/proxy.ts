import { Router, type Request, type Response } from "express";
import ipfs from "../lib/ipfs";
import { proxySchema } from "../utils/validator";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { cid, filename } = req.query;
    proxySchema.parse({ cid });
    const file = await prisma.file.findFirst({ where: { cid: cid as string } });
    const mimetype = file?.mimetype || "application/octet-stream";
    const chunks: Buffer[] = [];
    for await (const chunk of ipfs.cat(cid as string)) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);
    res.set("Content-Type", mimetype);
    if (filename) {
      res.set(
        "Content-Disposition",
        `attachment; filename="${decodeURIComponent(filename as string)}"`
      );
    }
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Proxy failed", details: (error as Error).message });
  }
});

export default router;
