"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../../components/navbar";
import { BackgroundBeams } from "@repo/ui/components/ui/background-beams";
import { Button } from "@repo/ui/components/ui/button";
import { TextGenerateEffect } from "@repo/ui/components/ui/text-generate-effect";

export default function HowItWorks() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Navbar />
      <BackgroundBeams className="opacity-20" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
            How MetaStor Works
          </h1>
          <p className="text-lg md:text-xl mb-8 text-zinc-300">
            Discover the technology behind our decentralized storage solution.
          </p>
        </motion.div>
      </section>

      {/* Process Steps */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto space-y-12">
            <ProcessStep
              number={1}
              title="File Encryption"
              description="Your files are encrypted on your device before being uploaded, ensuring end-to-end encryption."
            />
            <ProcessStep
              number={2}
              title="Data Sharding"
              description="Files are split into smaller pieces (shards) and distributed across the network."
            />
            <ProcessStep
              number={3}
              title="Blockchain Integration"
              description="File metadata and access permissions are recorded on the blockchain for security and transparency."
            />
            <ProcessStep
              number={4}
              title="Decentralized Storage"
              description="Shards are stored on multiple nodes in the network, ensuring high availability and redundancy."
            />
            <ProcessStep
              number={5}
              title="Retrieval and Reconstruction"
              description="When accessing your files, the shards are retrieved from the network and reassembled on your device."
            />
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 relative bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
            Our Technology Stack
          </h2>
          <div className="max-w-3xl mx-auto">
            <TextGenerateEffect words="MetaStor leverages cutting-edge technologies including IPFS (InterPlanetary File System) for distributed storage, Solana for smart contracts and blockchain integration, and advanced cryptographic algorithms for secure encryption. This combination ensures a robust, scalable, and secure decentralized storage solution." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <BackgroundBeams className="opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
              Ready to Experience the Future of Storage?
            </h2>
            <p className="text-lg mb-8 text-zinc-300">
              Join MetaStor today and take control of your data.
            </p>
            <RGBBorderButton />
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-zinc-500">
        <p>© 2024 MetaStor. All rights reserved.</p>
      </footer>
    </div>
  );
}

const ProcessStep = ({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mr-4">
      <span className="text-2xl font-bold text-zinc-200">{number}</span>
    </div>
    <div>
      <h3 className="text-2xl font-semibold mb-2 text-zinc-100">{title}</h3>
      <p className="text-zinc-300">{description}</p>
    </div>
  </div>
);

const RGBBorderButton = () => {
  return (
    <div className="relative inline-block">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <Button
        size="lg"
        className="relative px-7 py-4 bg-zinc-900 rounded-lg leading-none flex items-center divide-x divide-gray-600"
      >
        <span className="flex items-center space-x-5">
          <span className="pr-6 text-gray-100">Get Started</span>
        </span>
        <span className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200">
          →
        </span>
      </Button>
    </div>
  );
};
