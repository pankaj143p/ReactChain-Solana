"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  LuMenu,
  LuX,
  LuUser,
  LuUpload,
  LuLayoutDashboard,
  LuCreditCard,
  LuLogOut,
  LuBell,
  LuShield,
  LuZap,
} from "react-icons/lu";
import { FaHome as LuHome } from "react-icons/fa";
import { WalletConnectButton } from "./WalletConnect";
import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { useAuthStore } from "../store/authStore";
import { apiFetch } from "../lib/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";

interface SubscriptionData {
  tier: "free" | "basic" | "pro" | "enterprise";
  storageUsed: number;
  storageLimit: number;
  endDate?: string;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [notifications, setNotifications] = useState(0);
  const { token, pubKey, clearAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!token) return;

      try {
        const response = await apiFetch(
          "/api/subscription",
          { method: "GET" },
          token,
          clearAuth
        );
        const data = await response.data;
        setSubscription(data);

        // Check for storage warnings
        const storagePercentage = (data.storageUsed / data.storageLimit) * 100;
        if (storagePercentage > 90) {
          setNotifications((prev) => prev + 1);
        }

        // Check for subscription expiry
        if (data.endDate) {
          const daysUntilExpiry = Math.ceil(
            (new Date(data.endDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );
          if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
            setNotifications((prev) => prev + 1);
          }
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      }
    };

    fetchSubscription();
  }, [token]);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  const getStoragePercentage = () => {
    if (!subscription) return 0;
    return Math.min(
      (subscription.storageUsed / subscription.storageLimit) * 100,
      100
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    );
  };

  const tierColors = {
    free: "bg-gradient-to-r from-zinc-600 to-zinc-700 border-zinc-500",
    basic: "bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500",
    pro: "bg-gradient-to-r from-purple-600 to-indigo-700 border-purple-500",
    enterprise:
      "bg-gradient-to-r from-amber-600 to-orange-700 border-amber-500",
  };

  const tierIcons = {
    free: LuShield,
    basic: LuZap,
    pro: LuZap,
    enterprise: LuZap,
  };

  const navItems = [
    { href: "/", label: "Home", icon: LuHome },
    { href: "/upload", label: "Upload", icon: LuUpload, protected: true },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LuLayoutDashboard,
      protected: true,
    },
    {
      href: "/subscription",
      label: "Plans",
      icon: LuCreditCard,
      protected: true,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/98 border-b border-zinc-800/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-2xl font-bold text-zinc-100">
                  MetaStor
                </span>
              </motion.div>
            </Link>

            {/* Subscription Badge */}
            {subscription && subscription.tier && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-4 hidden sm:block"
              >
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-100 border border-blue-700/40 bg-zinc-900 shadow-lg`}
                >
                  {React.createElement(tierIcons[subscription.tier], {
                    className: "w-3 h-3 text-blue-400",
                  })}
                  {subscription.tier.toUpperCase()}
                </div>
              </motion.div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center space-x-1 bg-zinc-900 rounded-full p-1 border border-zinc-800/50 shadow">
              {navItems.map((item) => {
                if (item.protected && !token) return null;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative flex items-center gap-2 text-zinc-300 hover:text-zinc-100 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-zinc-800 hover:shadow-lg border border-transparent hover:border-blue-700/40"
                  >
                    <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200 text-blue-400" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {token ? (
              <>
                {/* Notifications */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-zinc-800 border border-zinc-800/50 rounded-full transition-all duration-300"
                  >
                    <LuBell className="h-5 w-5 text-blue-400" />
                    {notifications > 0 && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center border-2 border-zinc-950">
                        <span className="text-xs font-bold text-white">
                          {notifications}
                        </span>
                      </div>
                    )}
                  </Button>
                </motion.div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 hover:bg-zinc-800 border border-zinc-800/50 rounded-full px-4 py-2 transition-all duration-300"
                      >
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-blue-700/40">
                          <LuUser className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="hidden xl:inline font-mono text-sm text-zinc-300">
                          {pubKey?.slice(0, 4)}...{pubKey?.slice(-4)}
                        </span>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-72 bg-zinc-900 border border-zinc-800/50 rounded-xl shadow-2xl p-2"
                  >
                    <div className="px-4 py-3 border-b border-zinc-800/50">
                      <p className="text-sm font-semibold text-zinc-200">
                        Wallet Address
                      </p>
                      <p className="text-xs text-zinc-400 font-mono break-all mt-1 bg-zinc-800/50 px-2 py-1 rounded">
                        {pubKey}
                      </p>
                    </div>

                    {subscription && subscription.tier && (
                      <div className="px-4 py-3 border-b border-zinc-800/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-zinc-300">
                            Storage Usage
                          </span>
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold text-zinc-100 border border-blue-700/40 bg-zinc-900">
                            {React.createElement(tierIcons[subscription.tier], {
                              className: "w-3 h-3 text-blue-400",
                            })}
                            {subscription.tier.toUpperCase()}
                          </div>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2 mb-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-blue-700 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${getStoragePercentage()}%` }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                          />
                        </div>
                        <p className="text-xs text-zinc-400 flex justify-between">
                          <span>
                            {formatBytes(subscription.storageUsed)} used
                          </span>
                          <span>
                            {formatBytes(subscription.storageLimit)} total
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="py-1">
                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-zinc-300 hover:text-blue-400 focus:text-blue-400 bg-transparent hover:bg-zinc-800 focus:bg-zinc-800 border border-transparent hover:border-blue-700/40 focus:border-blue-700/40 rounded-lg transition-all duration-200 shadow-none hover:shadow-md focus:shadow-md"
                        >
                          <LuUser className="h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/subscription"
                          className="flex items-center gap-3 px-4 py-2 text-zinc-300 hover:text-blue-400 focus:text-blue-400 bg-transparent hover:bg-zinc-800 focus:bg-zinc-800 border border-transparent hover:border-blue-700/40 focus:border-blue-700/40 rounded-lg transition-all duration-200 shadow-none hover:shadow-md focus:shadow-md"
                        >
                          <LuCreditCard className="h-4 w-4" />
                          Subscription
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator className="bg-zinc-800/50" />
                    <div className="py-1">
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 focus:text-red-300 bg-transparent hover:bg-red-900/40 focus:bg-red-900/40 border border-transparent hover:border-red-500/40 focus:border-red-500/40 rounded-lg transition-all duration-200 shadow-none hover:shadow-md focus:shadow-md"
                      >
                        <LuLogOut className="h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="relative">
                <WalletConnectButton />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {token && notifications > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full border border-zinc-800/50"
              >
                <LuBell className="h-5 w-5 text-blue-400" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {notifications}
                  </span>
                </div>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-zinc-800 border border-zinc-800/50 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LuX className="h-6 w-6 text-zinc-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LuMenu className="h-6 w-6 text-zinc-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-zinc-950/98 backdrop-blur-xl rounded-b-2xl shadow-2xl border border-zinc-800/50 overflow-hidden mt-2"
            >
              <div className="px-4 py-4 space-y-3">
                {/* User Info (Mobile) */}
                {token && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-zinc-900 rounded-xl border border-blue-700/40 mb-4 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-blue-700/40">
                          <LuUser className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-zinc-300">
                          Wallet
                        </span>
                      </div>
                      {subscription && subscription.tier && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold text-zinc-100 border border-blue-700/40 bg-zinc-900">
                          {React.createElement(tierIcons[subscription.tier], {
                            className: "w-3 h-3 text-blue-400",
                          })}
                          {subscription.tier.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-mono text-zinc-400 break-all mb-3 bg-zinc-800/50 px-3 py-2 rounded-lg">
                      {pubKey}
                    </p>
                    {subscription && (
                      <div>
                        <div className="w-full bg-zinc-800 rounded-full h-2 mb-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-blue-700 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${getStoragePercentage()}%` }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                          />
                        </div>
                        <p className="text-xs text-zinc-400 flex justify-between">
                          <span>
                            {formatBytes(subscription.storageUsed)} used
                          </span>
                          <span>
                            {formatBytes(subscription.storageLimit)} total
                          </span>
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Navigation Items */}
                <div className="space-y-1">
                  {navItems.map((item, index) => {
                    if (item.protected && !token) return null;

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 text-zinc-300 hover:text-blue-400 focus:text-blue-400 hover:bg-zinc-800 focus:bg-zinc-800 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 border border-transparent hover:border-blue-700/40 focus:border-blue-700/40 shadow-none hover:shadow-md focus:shadow-md"
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon className="h-5 w-5 text-blue-400" />
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile Actions */}
                {token ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4 border-t border-zinc-800/50 space-y-1"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 text-zinc-300 hover:text-blue-400 focus:text-blue-400 hover:bg-zinc-800 focus:bg-zinc-800 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 border border-transparent hover:border-blue-700/40 focus:border-blue-700/40 shadow-none hover:shadow-md focus:shadow-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <LuUser className="h-5 w-5" />
                      Profile
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full justify-start gap-3 text-red-400 hover:text-red-300 focus:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 px-4 py-3 h-auto rounded-xl border border-transparent hover:border-red-500/20 focus:border-red-500/20 transition-all duration-200 shadow-none hover:shadow-md focus:shadow-md"
                    >
                      <LuLogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4 border-t border-zinc-800/50"
                  >
                    <WalletConnectButton />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
