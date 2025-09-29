import { z } from "zod";

export const authSchema = z.object({
  pubKey: z.string().min(1),
  signature: z.string().min(1),
  nonce: z.string().min(1),
});

export const confirmSchema = z.object({
  fileId: z.number(),
  signature: z.string().min(1),
});

export const filesSchema = z.object({ pubKey: z.string().min(1) });

export const proxySchema = z.object({ cid: z.string().min(1) });
