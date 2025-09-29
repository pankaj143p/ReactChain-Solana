"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../../components/navbar";
import { BackgroundBeams } from "@repo/ui/components/ui/background-beams";
import { Button } from "@repo/ui/components/ui/button";

const pricingPlans = [
  {
    name: "Basic",
    price: "$9.99",
    features: ["100GB Storage", "End-to-End Encryption", "24/7 Support"],
  },
  {
    name: "Pro",
    price: "$19.99",
    features: [
      "500GB Storage",
      "Advanced Security Features",
      "Priority Support",
      "API Access",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited Storage",
      "Dedicated Support Team",
      "Custom Integration",
      "SLA Guarantee",
    ],
  },
];

export default function Pricing() {
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
          <h1 className="text-5xl  md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg md:text-xl mb-8 text-zinc-300">
            Choose the plan that's right for you. No hidden fees, no surprises.
          </p>
        </motion.div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <FAQItem
              question="Can I upgrade or downgrade my plan at any time?"
              answer="Yes, you can change your plan at any time. The changes will be reflected in your next billing cycle."
            />
            <FAQItem
              question="Is there a free trial available?"
              answer="We offer a 14-day free trial for all our plans. No credit card required."
            />
            <FAQItem
              question="How secure is my data?"
              answer="We use state-of-the-art encryption and decentralized storage to ensure your data is always secure and private."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <BackgroundBeams className="opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 text-zinc-300">
              Choose your plan and start securing your data today.
            </p>
            <InfiniteScrollButton />
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-zinc-500">
        <p>© 2024 MetaStor. All rights reserved.</p>
      </footer>
    </div>
  );
}

const PricingCard = ({
  name,
  price,
  features,
}: {
  name: string;
  price: string;
  features: string[];
}) => (
  <div className="bg-zinc-900 p-8 rounded-lg shadow-lg border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
    <h3 className="text-3xl font-bold mb-4 text-zinc-100">{name}</h3>
    <p className="text-4xl font-bold mb-6 text-zinc-200">
      {price}
      <span className="text-lg font-normal text-zinc-400">/month</span>
    </p>
    <ul className="mb-8 space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-zinc-300">
          <svg
            className="w-5 h-5 mr-2 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
      Choose Plan
    </Button>
  </div>
);

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <div className="bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-800">
    <h3 className="text-xl font-semibold mb-2 text-zinc-100">{question}</h3>
    <p className="text-zinc-300">{answer}</p>
  </div>
);

const InfiniteScrollButton = () => {
  return (
    <Button
      size="lg"
      className="relative px-8 py-4 bg-zinc-900 rounded-lg text-zinc-100 overflow-hidden group"
    >
      <span className="relative z-10">Get Started</span>
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-75 animate-scroll"></div>
      </div>
    </Button>
  );
};
