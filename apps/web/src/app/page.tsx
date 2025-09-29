"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@repo/ui/components/ui/background-beams";
import { Button } from "@repo/ui/components/ui/button";
import { TextGenerateEffect } from "@repo/ui/components/ui/text-generate-effect";
import { Navbar } from "../components/navbar";
import { WalletConnectButton } from "../components/WalletConnect";

export default function Home() {
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
      <section id="home" className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-zinc-100">
            MetaStor: Decentralized Storage for the Future
          </h1>
          <p className="text-lg md:text-xl mb-8 text-zinc-300">
            Secure, efficient, and truly decentralized. Take control of your
            data.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Button
              size="lg"
              className="relative px-7 py-4 bg-zinc-900 rounded-lg border border-blue-700/40 shadow-lg"
            >
              <WalletConnectButton />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="ml-4 border-blue-700/40 text-zinc-100 hover:bg-zinc-800 bg-zinc-900 hover:text-zinc-100 transition-all duration-300"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section id="features" className="py-20 relative bg-zinc-950">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-8 text-center text-zinc-100">
            The Problem We're Solving
          </h2>
          <div className="max-w-3xl mx-auto">
            <TextGenerateEffect words="In today's digital age, centralized storage solutions pose significant risks to data privacy, security, and ownership. Traditional cloud storage providers have control over your data, leaving it vulnerable to breaches, censorship, and unauthorized access. MetaStor addresses these critical issues by leveraging blockchain technology and decentralized storage protocols." />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative bg-zinc-950">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-center text-zinc-100">
            Why Choose MetaStor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Decentralized Card */}
            <div className="bg-zinc-900 rounded-2xl shadow-lg border border-blue-700/40 p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500">
              <div className="mb-4 p-4 rounded-full bg-zinc-800 border border-blue-700/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-blue-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-zinc-100">
                Decentralized
              </h3>
              <p className="text-zinc-400">
                Your data is distributed across a network of nodes, eliminating
                single points of failure.
              </p>
            </div>
            {/* Secure Card */}
            <div className="bg-zinc-900 rounded-2xl shadow-lg border border-emerald-700/40 p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-emerald-500">
              <div className="mb-4 p-4 rounded-full bg-zinc-800 border border-emerald-700/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-emerald-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-zinc-100">
                Secure
              </h3>
              <p className="text-zinc-400">
                Advanced encryption and blockchain technology ensure your data
                remains private and tamper-proof.
              </p>
            </div>
            {/* Efficient Card */}
            <div className="bg-zinc-900 rounded-2xl shadow-lg border border-purple-700/40 p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-purple-500">
              <div className="mb-4 p-4 rounded-full bg-zinc-800 border border-purple-700/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-purple-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-zinc-100">
                Efficient
              </h3>
              <p className="text-zinc-400">
                Optimized data storage and retrieval processes ensure fast
                access to your files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 relative bg-zinc-950">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-center text-zinc-100">
            How MetaStor Works
          </h2>
          <div className="max-w-3xl mx-auto">
            <TextGenerateEffect words="MetaStor utilizes advanced blockchain technology and IPFS (InterPlanetary File System) to create a decentralized storage network. Your files are encrypted, split into pieces, and distributed across the network, ensuring maximum security and availability. This approach eliminates single points of failure and gives you complete control over your data." />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-center text-zinc-100">
            Uncompromising Security
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-900 p-6 rounded-lg shadow-lg border border-blue-700/40 hover:border-blue-600 transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-zinc-100">
                End-to-End Encryption
              </h3>
              <p className="text-zinc-300">
                Your data is encrypted before it leaves your device, ensuring
                that only you have access to your files.
              </p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-lg shadow-lg border border-blue-700/40 hover:border-blue-600 transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-zinc-100">
                Blockchain Verification
              </h3>
              <p className="text-zinc-300">
                Every file transaction is recorded on the blockchain, providing
                an immutable audit trail and preventing unauthorized
                modifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section
        id="team"
        className="py-20 relative bg-gradient-to-b from-zinc-950 to-zinc-900"
      >
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
            Meet Our Team
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <AnimatedTooltip items={teamMembers} />
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 relative">
        <BackgroundBeams className="opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6 text-zinc-100">
              Ready to Take Control of Your Data?
            </h2>
            <p className="text-lg mb-8 text-zinc-300">
              Join MetaStor today and experience the future of decentralized
              storage.
            </p>
            <Button
              size="lg"
              className="relative px-7 py-4 bg-zinc-900 rounded-lg border border-blue-700/40 shadow-lg"
            >
              <WalletConnectButton />
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-zinc-500">
        <p>© 2024 MetaStor. All rights reserved.</p>
      </footer>
    </div>
  );
}
