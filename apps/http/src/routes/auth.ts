import { Router, type Request, type Response } from "express";
import { PublicKey } from "@solana/web3.js";
import * as nacl from "tweetnacl";
import prisma from "../lib/prisma";
import { authSchema } from "../utils/validator";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { pubKey, signature, nonce } = authSchema.parse(req.body);

    console.log("Here1")

    const msgBuffer = Buffer.from(nonce, "utf8");
    const msg = new Uint8Array(msgBuffer);

    const sigBuffer = Buffer.from(signature, "base64");
    const sig = new Uint8Array(sigBuffer);

    if (sig.length !== 64) {
      throw new Error(
        `Invalid signature length: must be 64 bytes (got ${sig.length}). Check if the base64 string is complete (should be ~88 chars).`
      );
    }

    const pub = new PublicKey(pubKey);
    const pubBytes = new Uint8Array(pub.toBytes());

    if (pubBytes.length !== 32) {
      throw new Error("Invalid public key length: must be 32 bytes");
    }

    const verified = nacl.sign.detached.verify(msg, sig, pubBytes);
    if (!verified) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    await prisma.user.upsert({
      where: { pubKey },
      update: {},
      create: { pubKey },
    });

    const token = jwt.sign({ pubKey }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({ success: true, token, user: { pubKey } });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: "Authentication failed",
      details: (error as Error).message,
    });
  }
});

export default router;
