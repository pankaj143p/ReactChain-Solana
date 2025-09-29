"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../../components/navbar";
import { BackgroundBeams } from "@repo/ui/components/ui/background-beams";
import { Button } from "@repo/ui/components/ui/button";
import { SparklesCore } from "@repo/ui/components/ui/sparkles";
import { TextGenerateEffect } from "@repo/ui/components/ui/text-generate-effect";
import { HoverEffect } from "@repo/ui/components/ui/card-hover-effect";

export default function Features() {
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
            MetaStor Features
          </h1>
          <p className="text-lg md:text-xl mb-8 text-zinc-300">
            Discover the power of decentralized storage with our cutting-edge
            features.
          </p>
        </motion.div>
      </section>

      {/* Main Features Section */}
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
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
            Core Features
          </h2>
          <HoverEffect
            items={[
              {
                title: "Decentralized Storage",
                description:
                  "Your data is distributed across a global network, ensuring high availability and eliminating single points of failure.",
                image: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                    />
                  </svg>
                ),
              },
              {
                title: "End-to-End Encryption",
                description:
                  "Your files are encrypted before leaving your device, ensuring only you can access your data.",
                image: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                ),
              },
              {
                title: "Blockchain Verification",
                description:
                  "Every transaction is recorded on the blockchain, providing an immutable audit trail.",
                image: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 relative bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
            Advanced Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              title="Smart Contracts Integration"
              description="Leverage blockchain smart contracts for automated data management and access control."
            />
            <FeatureCard
              title="Multi-Device Sync"
              description="Seamlessly access your files across all your devices with real-time synchronization."
            />
            <FeatureCard
              title="Version Control"
              description="Keep track of file changes and easily revert to previous versions when needed."
            />
            <FeatureCard
              title="Collaborative Workspaces"
              description="Create secure, decentralized spaces for team collaboration and file sharing."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
            How It Works
          </h2>
          <div className="max-w-3xl mx-auto">
            <TextGenerateEffect words="MetaStor uses advanced blockchain technology and IPFS to create a decentralized storage network. Your files are encrypted, split into pieces, and distributed across the network. This approach ensures maximum security, availability, and gives you full control over your data." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <BackgroundBeams className="opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
              Ready to Experience MetaStor?
            </h2>
            <p className="text-lg mb-8 text-zinc-300">
              Join us today and revolutionize the way you store and manage your
              data.
            </p>
            <AnimatedGradientButton />
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-zinc-500">
        <p>© 2024 MetaStor. All rights reserved.</p>
      </footer>
    </div>
  );
}

const FeatureCard = ({
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

const AnimatedGradientButton = () => {
  return (
    <div className="relative inline-block group">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-zinc-400 via-zinc-600 to-zinc-800 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
        animate={{
          background: [
            "linear-gradient(0deg, #52525b, #71717a, #3f3f46)",
            "linear-gradient(120deg, #71717a, #3f3f46, #52525b)",
            "linear-gradient(240deg, #3f3f46, #52525b, #71717a)",
          ],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 5,
          ease: "linear",
        }}
      />
      <Button
        size="lg"
        className="relative px-7 py-4 bg-zinc-900 rounded-lg leading-none flex items-center divide-x divide-gray-600"
      >
        <span className="flex items-center space-x-5">
          <motion.span
            className="pr-6 text-gray-100"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            Get Started
          </motion.span>
        </span>
        <span className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200">
          →
        </span>
      </Button>
    </div>
  );
};
