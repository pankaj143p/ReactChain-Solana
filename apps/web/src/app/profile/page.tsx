"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LuWallet,
  LuFileText,
  LuUser,
  LuCreditCard,
  LuHardDrive,
  LuCalendar,
  LuTrendingUp,
  LuRefreshCw,
  LuCrown,
  LuZap,
  LuBuilding,
  LuTrendingDown,
} from "react-icons/lu";
import { AuthGuard } from "../../components/AuthGuard";
import { Navbar } from "../../components/navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Progress } from "@repo/ui/components/ui/progress";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { apiFetch } from "../../lib/api";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useAuthStore } from "../../store/authStore";
import { motion } from "framer-motion";
import Link from "next/link";

interface SubscriptionData {
  subscription: {
    tier: "free" | "basic" | "pro" | "enterprise";
    period?: "monthly" | "yearly";
    startDate?: string;
    endDate?: string;
    active: boolean;
  };
  plan: {
    name: string;
    storageLimit: string;
    features: string[];
  };
  storageUsed: string;
  storageLimit: string;
}

interface PaymentHistory {
  id: string;
  amount: number;
  tier: string;
  period: string;
  transactionId: string;
  createdAt: string;
  status: "completed" | "pending" | "failed";
}

const tierConfig = {
  free: {
    name: "Free",
    icon: LuUser,
    color: "bg-zinc-500",
    textColor: "text-zinc-400",
    features: ["100MB Storage", "Basic Support"],
  },
  basic: {
    name: "Basic",
    icon: LuZap,
    color: "bg-blue-500",
    textColor: "text-blue-400",
    features: ["1GB Storage", "Email Support", "File Sharing"],
  },
  pro: {
    name: "Pro",
    icon: LuCrown,
    color: "bg-purple-500",
    textColor: "text-purple-400",
    features: [
      "5GB Storage",
      "Priority Support",
      "Advanced Analytics",
      "Team Collaboration",
    ],
  },
  enterprise: {
    name: "Enterprise",
    icon: LuBuilding,
    color: "bg-amber-500",
    textColor: "text-amber-400",
    features: [
      "100GB Storage",
      "24/7 Support",
      "Custom Integration",
      "Advanced Security",
    ],
  },
};

export default function ProfilePage() {
  const { pubKey, token, clearAuth } = useAuthStore();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfileData = async () => {
    if (!token || !pubKey) {
      setLoading(false);
      return;
    }

    try {
      // Fetch all data in parallel
      const [filesResponse, subscriptionResponse, historyResponse] =
        await Promise.all([
          apiFetch(
            "/api/files?count=true",
            { method: "GET" },
            token,
            clearAuth
          ),
          apiFetch("/api/subscription", { method: "GET" }, token, clearAuth),
          apiFetch(
            "/api/subscription/history",
            { method: "GET" },
            token,
            clearAuth
          ).catch(() => ({ data: [] })),
        ]);

      const filesData = await filesResponse.data;
      const subData = await subscriptionResponse.data;
      const historyData = await historyResponse.data;

      setFileCount(filesData.count || 0);
      setSubscription(subData);
      setPaymentHistory(historyData || []);

      // Fetch wallet balance
      if (connection) {
        const pubKeyObj = new PublicKey(pubKey);
        const lamports = await connection.getBalance(pubKeyObj);
        setBalance(lamports / LAMPORTS_PER_SOL);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch profile data");
      console.error("Profile fetch error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProfileData();
      setLoading(false);
    };
    loadData();
  }, [token, pubKey, connection]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfileData();
    setRefreshing(false);
    toast.success("Profile data refreshed");
  };

  const formatBytes = (bytes: string) => {
    const size = Number(bytes);
    if (size === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return (
      Number.parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getStoragePercentage = () => {
    if (!subscription) return 0;
    const used = Number(subscription.storageUsed);
    const limit = Number(subscription.storageLimit);
    return Math.min((used / limit) * 100, 100);
  };

  const getDaysUntilExpiry = () => {
    if (!subscription?.subscription.endDate) return null;
    const now = new Date();
    const expiry = new Date(subscription.subscription.endDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black"></div>
          <Navbar />
          <section className="container mx-auto px-4 py-16 relative z-10">
            <div className="space-y-6">
              <Skeleton className="h-12 w-64 mx-auto bg-zinc-800/50" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-32 bg-zinc-800/50" />
                ))}
              </div>
            </div>
          </section>
        </div>
      </AuthGuard>
    );
  }

  const currentTier = subscription?.subscription.tier || "free";
  const TierIcon = tierConfig[currentTier].icon;

  return (
    <AuthGuard>
      {/* 1. Enhance main container with a deep gradient and glassmorphism effect */}
      <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-foreground overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-900/30 via-zinc-900/60 to-purple-900/40 blur-2xl opacity-80" />
        </div>
        <Navbar />
        <section className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
                Profile
              </h1>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-border hover:bg-muted bg-zinc-900/60 backdrop-blur-md shadow-lg"
              >
                <LuRefreshCw
                  className={`h-6 w-6 ${refreshing ? "animate-spin" : ""} text-blue-400 drop-shadow-md`}
                />
              </Button>
            </div>
            <p className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto font-medium">
              Manage your account, subscription, and storage in style.
            </p>
          </motion.div>
          <Tabs defaultValue="overview" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 bg-zinc-800/80 backdrop-blur-md rounded-xl shadow-lg">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            {/* --- Overview Tab --- */}
            <TabsContent value="overview" className="space-y-8 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Wallet Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-zinc-900/70 border border-blue-800/40 shadow-xl backdrop-blur-xl rounded-2xl hover:shadow-blue-700/30 transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-xl font-bold text-blue-300">
                        <LuWallet className="h-7 w-7 text-blue-400 drop-shadow" />
                        Wallet
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-zinc-400">Address</p>
                        <p className="font-mono text-base break-all text-blue-200 bg-zinc-800/60 px-2 py-1 rounded-lg">
                          {pubKey?.slice(0, 8)}...{pubKey?.slice(-8)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Balance</p>
                        <p className="text-2xl font-extrabold text-blue-300">
                          {balance !== null ? balance.toFixed(4) : "0.0000"}{" "}
                          <span className="text-blue-400">SOL</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                {/* Current Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="bg-zinc-900/70 border border-purple-800/40 shadow-xl backdrop-blur-xl rounded-2xl hover:shadow-purple-700/30 transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-xl font-bold text-purple-300">
                        <TierIcon
                          className={`h-7 w-7 ${tierConfig[currentTier].textColor} drop-shadow`}
                        />
                        Current Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`bg-gradient-to-r from-purple-500 to-amber-500 text-white px-4 py-1 rounded-full shadow-md text-base font-semibold tracking-wide`}
                        >
                          {tierConfig[currentTier].name}
                        </Badge>
                        {subscription?.subscription.period && (
                          <Badge
                            variant="outline"
                            className="border-purple-400 text-purple-200 bg-zinc-800/60 px-3 py-1 rounded-full"
                          >
                            {subscription.subscription.period}
                          </Badge>
                        )}
                      </div>
                      {subscription?.subscription.endDate && (
                        <div>
                          <p className="text-sm text-zinc-400">Expires in</p>
                          <p className="text-lg font-semibold text-amber-300">
                            {getDaysUntilExpiry()} days
                          </p>
                        </div>
                      )}
                      <Link href="/subscription">
                        <Button
                          size="lg"
                          className="w-full bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold shadow-lg rounded-xl py-2 text-lg"
                        >
                          Manage Plan
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
                {/* Files Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="bg-zinc-900/70 border border-cyan-800/40 shadow-xl backdrop-blur-xl rounded-2xl hover:shadow-cyan-700/30 transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-xl font-bold text-cyan-300">
                        <LuFileText className="h-7 w-7 text-cyan-400 drop-shadow" />
                        Files
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-zinc-400">Total Files</p>
                        <p className="text-3xl font-extrabold text-cyan-200">
                          {fileCount}
                        </p>
                      </div>
                      <Link href="/dashboard">
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full border-cyan-400 text-cyan-200 hover:bg-cyan-900/20 bg-zinc-800/60 font-bold rounded-xl py-2 text-lg"
                        >
                          View Files
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
            {/* --- Subscription Tab --- */}
            <TabsContent value="subscription" className="space-y-8 mt-8">
              <Card className="bg-zinc-900/80 border border-purple-800/40 shadow-2xl backdrop-blur-xl rounded-2xl p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-purple-300">
                    <LuCreditCard className="h-7 w-7 text-amber-400 drop-shadow" />
                    Subscription Details
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Manage your MetaStor subscription and billing preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2 text-lg text-purple-200">
                          Current Plan
                        </h3>
                        <div className="flex items-center gap-4 p-4 bg-zinc-800/60 rounded-xl border border-purple-700/40 shadow-md">
                          <TierIcon
                            className={`h-10 w-10 ${tierConfig[currentTier].textColor} drop-shadow`}
                          />
                          <div>
                            <p className="font-semibold text-lg text-purple-100">
                              {tierConfig[currentTier].name}
                            </p>
                            <p className="text-sm text-zinc-400">
                              {subscription?.subscription.period
                                ? `Billed ${subscription.subscription.period}`
                                : "Free tier"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-lg text-purple-200">
                          Features
                        </h3>
                        <ul className="space-y-2">
                          {subscription?.plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-3 text-base text-zinc-300"
                            >
                              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-amber-400 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {subscription?.subscription.endDate && (
                        <div>
                          <h3 className="font-semibold mb-2 text-lg text-purple-200">
                            Billing Cycle
                          </h3>
                          <div className="p-4 bg-zinc-800/60 rounded-xl border border-purple-700/40 shadow-md">
                            <div className="flex items-center gap-2 mb-2">
                              <LuCalendar className="h-5 w-5 text-amber-400" />
                              <span className="text-base text-zinc-400">
                                Next billing date
                              </span>
                            </div>
                            <p className="font-semibold text-lg text-amber-300">
                              {new Date(
                                subscription.subscription.endDate
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-zinc-400 mt-1">
                              {getDaysUntilExpiry()} days remaining
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col gap-4 mt-6">
                        <Link href="/subscription">
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold shadow-lg rounded-xl py-2 text-lg">
                            {currentTier === "free"
                              ? "Upgrade Plan"
                              : "Change Plan"}
                          </Button>
                        </Link>
                        {currentTier !== "free" && (
                          <Button
                            variant="outline"
                            className="w-full border-purple-400 text-purple-200 hover:bg-purple-900/20 bg-zinc-800/60 font-bold rounded-xl py-2 text-lg"
                          >
                            Cancel Subscription
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* --- Storage Tab --- */}
            <TabsContent value="storage" className="space-y-8 mt-8">
              <Card className="bg-zinc-900/80 border border-cyan-800/40 shadow-2xl backdrop-blur-xl rounded-2xl p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-cyan-300">
                    <LuHardDrive className="h-7 w-7 text-cyan-400 drop-shadow" />
                    Storage Usage
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Monitor your storage usage and manage your files.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-base text-zinc-400">
                        Storage Used
                      </span>
                      <span className="text-base font-medium text-zinc-200">
                        {subscription
                          ? formatBytes(subscription.storageUsed)
                          : "0 B"}{" "}
                        /{" "}
                        {subscription
                          ? formatBytes(subscription.storageLimit)
                          : "100 MB"}
                      </span>
                    </div>
                    {/* Custom Progress Bar */}
                    <div className="relative w-full h-6 rounded-full bg-zinc-800/60 overflow-hidden border border-cyan-700/40 shadow-inner">
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-pulse"
                        style={{ width: `${getStoragePercentage()}%` }}
                      />
                      <div className="absolute inset-0 flex justify-between text-xs text-zinc-400 px-3 h-full items-center">
                        <span>0%</span>
                        <span>{getStoragePercentage().toFixed(1)}% used</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                  {getStoragePercentage() > 80 && (
                    <div className="p-5 bg-gradient-to-r from-amber-900/40 to-amber-800/40 border border-amber-500/60 rounded-xl mt-8 shadow-lg flex items-center gap-4 animate-pulse">
                      <LuTrendingUp className="h-8 w-8 text-amber-400 drop-shadow" />
                      <div>
                        <span className="font-bold text-amber-300 text-lg">
                          Storage Warning
                        </span>
                        <p className="text-sm text-amber-200 mt-1">
                          You're running low on storage space. Consider
                          upgrading your plan or deleting unused files.
                        </p>
                        <div className="flex gap-3 mt-3">
                          <Link href="/subscription">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-xl"
                            >
                              Upgrade Plan
                            </Button>
                          </Link>
                          <Link href="/dashboard">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-amber-600 text-amber-400 hover:bg-amber-900/20 bg-zinc-800/60 font-bold rounded-xl"
                            >
                              Manage Files
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <div className="p-5 bg-zinc-800/70 rounded-xl border border-blue-700/40 shadow-md flex flex-col items-center">
                      <LuFileText className="h-7 w-7 text-blue-400 mb-2" />
                      <span className="text-base text-zinc-400">
                        Total Files
                      </span>
                      <p className="text-3xl font-extrabold text-blue-200 mt-1">
                        {fileCount}
                      </p>
                    </div>
                    <div className="p-5 bg-zinc-800/70 rounded-xl border border-cyan-700/40 shadow-md flex flex-col items-center">
                      <LuHardDrive className="h-7 w-7 text-cyan-400 mb-2" />
                      <span className="text-base text-zinc-400">
                        Used Space
                      </span>
                      <p className="text-3xl font-extrabold text-cyan-200 mt-1">
                        {subscription
                          ? formatBytes(subscription.storageUsed)
                          : "0 B"}
                      </p>
                    </div>
                    <div className="p-5 bg-zinc-800/70 rounded-xl border border-green-700/40 shadow-md flex flex-col items-center">
                      <LuTrendingDown className="h-7 w-7 text-green-400 mb-2" />
                      <span className="text-base text-zinc-400">Available</span>
                      <p className="text-3xl font-extrabold text-green-200 mt-1">
                        {subscription
                          ? formatBytes(
                              (
                                Number(subscription.storageLimit) -
                                Number(subscription.storageUsed)
                              ).toString()
                            )
                          : "100 MB"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* --- Billing Tab --- */}
            <TabsContent value="billing" className="space-y-8 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/90 border border-amber-800/40 shadow-2xl backdrop-blur-xl rounded-2xl p-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-4 text-2xl font-bold text-amber-300">
                      <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                        <LuCreditCard className="h-7 w-7 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
                        Payment History
                      </span>
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      View your past transactions and billing history.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {paymentHistory.length > 0 ? (
                      <div className="space-y-6">
                        {paymentHistory.map((payment, idx) => (
                          <div
                            key={payment.id}
                            className={`flex items-center justify-between p-5 rounded-xl border shadow-md bg-zinc-800/70 border-zinc-700/60 relative ${idx !== paymentHistory.length - 1 ? "after:absolute after:left-6 after:top-full after:w-0.5 after:h-6 after:bg-gradient-to-b after:from-amber-400/40 after:to-zinc-800/0" : ""}`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-4 h-4 rounded-full shadow-lg ${
                                  payment.status === "completed"
                                    ? "bg-green-500 animate-pulse"
                                    : payment.status === "pending"
                                      ? "bg-yellow-500 animate-pulse"
                                      : "bg-red-500 animate-pulse"
                                }`}
                              />
                              <div>
                                <p className="font-semibold capitalize text-zinc-200 text-lg">
                                  {payment.tier} - {payment.period}
                                </p>
                                <p className="text-sm text-zinc-400">
                                  {new Date(
                                    payment.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-amber-300 text-xl">
                                {payment.amount}{" "}
                                <span className="text-amber-400">SOL</span>
                              </p>
                              <p className="text-xs text-zinc-400 font-mono">
                                {payment.transactionId.slice(0, 8)}...
                                {payment.transactionId.slice(-8)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <LuCreditCard className="h-16 w-16 text-zinc-700 mx-auto mb-6" />
                        <p className="text-zinc-400 text-lg font-semibold">
                          No payment history found
                        </p>
                        <p className="text-base text-zinc-500 mt-2">
                          Your subscription payments will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </AuthGuard>
  );
}
