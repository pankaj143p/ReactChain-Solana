export interface SubscriptionPlan {
  tier: string;
  name: string;
  description: string;
  monthlyPriceUSD: number;
  yearlyPriceUSD: number;
  storageLimit: bigint;
  features: string[];
  popular?: boolean;
  color: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: "free",
    name: "Free",
    description: "Perfect for getting started",
    monthlyPriceUSD: 0,
    yearlyPriceUSD: 0,
    storageLimit: BigInt(100 * 1024 * 1024), // 100MB
    features: [
      "100MB Storage",
      "Basic IPFS Storage",
      "File Upload & Download",
      "Community Support",
    ],
    color: "zinc",
  },
  {
    tier: "basic",
    name: "Basic",
    description: "Great for personal use",
    monthlyPriceUSD: 5,
    yearlyPriceUSD: 50,
    storageLimit: BigInt(1024 * 1024 * 1024), // 1GB
    features: [
      "1GB Storage",
      "Fast IPFS Storage",
      "File Upload & Download",
      "Email Support",
      "File Sharing",
    ],
    color: "blue",
  },
  {
    tier: "pro",
    name: "Pro",
    description: "Perfect for professionals",
    monthlyPriceUSD: 15,
    yearlyPriceUSD: 150,
    storageLimit: BigInt(5 * 1024 * 1024 * 1024), // 5GB
    features: [
      "5GB Storage",
      "Premium IPFS Storage",
      "Advanced File Management",
      "Priority Support",
      "File Sharing & Collaboration",
      "Analytics Dashboard",
    ],
    popular: true,
    color: "purple",
  },
  {
    tier: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    monthlyPriceUSD: 50,
    yearlyPriceUSD: 500,
    storageLimit: BigInt(100 * 1024 * 1024 * 1024), // 100GB
    features: [
      "100GB Storage",
      "Enterprise IPFS Storage",
      "Advanced File Management",
      "24/7 Priority Support",
      "Team Collaboration",
      "Advanced Analytics",
      "Custom Integrations",
      "SLA Guarantee",
    ],
    color: "amber",
  },
];

export function getPlanByTier(tier: string): SubscriptionPlan {
  return (
    SUBSCRIPTION_PLANS.find((plan) => plan.tier === tier) ||
    SUBSCRIPTION_PLANS[0]
  );
}

export async function getSolPrice(): Promise<number> {
  try {
    // Mock SOL price for development - in production, use real price oracle
    return 20; // $20 per SOL
  } catch (error) {
    console.error("Failed to get SOL price:", error);
    return 20; // Fallback price
  }
}

export function calculateSolAmount(
  usdAmount: number,
  solPrice: number
): number {
  return Number((usdAmount / solPrice).toFixed(4));
}

export function formatBytes(bytes: bigint | number): string {
  const size = typeof bytes === "bigint" ? Number(bytes) : bytes;
  if (size === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  let value = size;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatStoragePercentage(used: bigint, limit: bigint): number {
  if (limit === BigInt(0)) return 0;
  return Math.min(Number((used * BigInt(100)) / limit), 100);
}
