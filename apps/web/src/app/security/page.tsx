"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../../components/navbar";
import { BackgroundBeams } from "@repo/ui/components/ui/background-beams";
import { Button } from "@repo/ui/components/ui/button";
import { SparklesCore } from "@repo/ui/components/ui/sparkles";
import { TextGenerateEffect } from "@repo/ui/components/ui/text-generate-effect";

export default function Security() {
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
            Uncompromising Security
          </h1>
          <p className="text-lg md:text-xl mb-8 text-zinc-300">
            Your data's safety is our top priority. Discover how we protect your
            information.
          </p>
        </motion.div>
      </section>

      {/* Security Features */}
      <section className="py-20 relative">
        <div className="absolute inset-0 z-0">
          <SparklesCore
            id="tsparticles"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#71717a"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SecurityFeature
              title="End-to-End Encryption"
              description="Your data is encrypted before it leaves your device, ensuring that only you have access to your files."
            />
            <SecurityFeature
              title="Blockchain Verification"
              description="Every file transaction is recorded on the blockchain, providing an immutable audit trail and preventing unauthorized modifications."
            />
            <SecurityFeature
              title="Decentralized Storage"
              description="Your data is distributed across multiple nodes, eliminating single points of failure and increasing resilience against attacks."
            />
            <SecurityFeature
              title="Zero-Knowledge Proofs"
              description="Our system uses zero-knowledge proofs to verify transactions without revealing sensitive information."
            />
          </div>
        </div>
      </section>

      {/* Security Process */}
      <section className="py-20 relative bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
            Our Security Process
          </h2>
          <div className="max-w-3xl mx-auto">
            <TextGenerateEffect words="At MetaStor, security is not just a feature, it's the foundation of our entire system. We employ military-grade encryption, conduct regular security audits, and continuously update our protocols to stay ahead of potential threats. Our decentralized architecture ensures that there's no central point of vulnerability, making your data resilient against breaches and unauthorized access." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <BackgroundBeams className="opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
              Secure Your Data Today
            </h2>
            <p className="text-lg mb-8 text-zinc-300">
              Experience the peace of mind that comes with truly secure storage.
            </p>
            <NeonGlowButton />
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-zinc-500">
        <p>© 2024 MetaStor. All rights reserved.</p>
      </footer>
    </div>
  );
}

const SecurityFeature = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
    <h3 className="text-2xl font-semibold mb-4 text-zinc-100">{title}</h3>
    <p className="text-zinc-300">{description}</p>
  </div>
);

const NeonGlowButton = () => {
  return (
    <Button
      size="lg"
      className="relative px-8 py-4 bg-zinc-900 rounded-lg text-zinc-100 overflow-hidden group"
    >
      <span className="relative z-10">Get Started</span>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-300"></div>
    </Button>
  );
};
