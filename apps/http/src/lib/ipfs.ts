import { create } from "ipfs-http-client";

const ipfs = create({ url: process.env.IPFS_API_URL });

export default ipfs;

export async function addToIPFS(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const { cid } = await ipfs.add({ content: buffer, path: fileName });
  return cid.toString();
}
