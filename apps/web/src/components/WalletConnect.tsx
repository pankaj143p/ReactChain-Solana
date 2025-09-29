"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@repo/ui/components/ui/button";
import {  LuLogOut, LuShield, LuUser } from "react-icons/lu";
import { apiFetch } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/ui/alert-dialog";

export function WalletConnectButton() {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const router = useRouter();
  const { pubKey, token, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, [setAuth]);

  useEffect(() => {
    if (!connected) {
      clearAuth();
    }
  }, [connected, clearAuth]);

  const handleAuth = async () => {
    if (!publicKey || !signMessage) return;

    try {
      const nonce = `MetaStor Login ${Date.now()}`;
      const message = new TextEncoder().encode(nonce);

      toast.loading("Please sign the message...");
      const signature = await signMessage(message);

      const signatureBase64 = btoa(
        String.fromCharCode(...Array.from(signature))
      );

      const response = await apiFetch(
        "/api/auth",
        {
          method: "POST",
          body: JSON.stringify({
            pubKey: publicKey.toBase58(),
            signature: signatureBase64,
            nonce,
          }),
        },
        token || undefined,
        clearAuth
      );

      const data = await response.data;

      if (data.success) {
        setAuth({ token: data.token, pubKey: data.user.pubKey });
        toast.dismiss();
        toast.success("Authenticated successfully!");
        router.push("/dashboard");
      } else {
        throw new Error(data.error || "Authentication failed");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Authentication failed"
      );
      console.error("Auth error:", error);
    }
  };

  const handleLogout = () => {
    clearAuth();
    disconnect();
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (connected && token && pubKey) {
    return (
      <div className="flex items-center space-x-3">
        {/* User Status Badge */}
        <div className="hidden md:flex items-center space-x-2 bg-zinc-800 px-4 py-2 rounded-xl border border-blue-700/40 shadow">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <LuUser className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-zinc-300">
              {pubKey.slice(0, 6)}...{pubKey.slice(-4)}
            </span>
          </div>
        </div>

        {/* Wallet Button with Custom Styling */}
        <div className="wallet-button-container">
          <WalletMultiButton />
        </div>

        {/* Logout Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-zinc-800 border border-blue-700/40 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 transition-all duration-300 shadow"
            >
              <LuLogOut className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-zinc-900 border-blue-700/40 border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-zinc-100 flex items-center space-x-2">
                <LuLogOut className="h-5 w-5 text-blue-400" />
                <span>Confirm Logout</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400">
                Are you sure you want to disconnect your wallet and log out?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-zinc-800 border border-blue-700/40 text-zinc-300 hover:bg-zinc-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-red-700 hover:bg-red-800 text-white border border-red-800"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  if (connected && !token) {
    return (
      <div className="flex items-center space-x-3">
        {/* Authentication Button */}
        <Button
          onClick={handleAuth}
          className="bg-blue-700 hover:bg-blue-800 text-white border border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <LuShield className="mr-2 h-4 w-4 text-blue-400" />
          Authenticate
        </Button>

        {/* Wallet Button */}
        <div className="wallet-button-container">
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connect-container">
      <div className="wallet-button-container">
        <WalletMultiButton />
      </div>
    </div>
  );
}
