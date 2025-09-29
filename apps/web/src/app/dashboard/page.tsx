"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  LuUpload,
  LuDownload,
  LuTrash2,
  LuFile,
  LuImage,
  LuVideo,
  LuMusic,
  LuFileText,
  LuArchive,
  LuRefreshCw,
  LuHardDrive,
  LuTrendingUp,
  LuSearch,
  LuFilter,
  LuList,
  LuCalendar,
  LuEye,
  LuCloud,
  LuShield,
  LuZap,
  LuActivity,
  LuFolderOpen,
  LuStar,
  LuX,
} from "react-icons/lu";
import { CiGrid31 as LuGrid } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
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
import { Input } from "@repo/ui/components/ui/input";
import { Badge } from "@repo/ui/components/ui/badge";
import { Progress } from "@repo/ui/components/ui/progress";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { apiFetch } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/ui/dialog";

interface FileData {
  id: number;
  fileName: string;
  cid: string;
  timestamp: string;
  size: string;
  paid: boolean;
}

interface StorageData {
  used: string;
  limit: string;
  tier: string;
  percentage: number;
}

export default function DashboardPage() {
  const { token, clearAuth } = useAuthStore();
  const [files, setFiles] = useState<FileData[]>([]);
  const [storageData, setStorageData] = useState<StorageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [filterType, setFilterType] = useState<
    "all" | "images" | "documents" | "videos" | "audio" | "archives"
  >("all");
  const [previewFile, setPreviewFile] = useState<FileData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [filesResponse, storageResponse] = await Promise.all([
        apiFetch(
          "/api/files",
          { method: "GET" },
          token || undefined,
          clearAuth
        ),
        apiFetch(
          "/api/subscription/storage",
          { method: "GET" },
          token || undefined,
          clearAuth
        ),
      ]);

      const filesData = await filesResponse.data;
      const storageInfo = await storageResponse.data;

      setFiles(filesData.files || []);
      setStorageData(storageInfo);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch dashboard data");
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    loadData();
  }, [token]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  const handleDelete = async (fileId: number) => {
    try {
      await apiFetch(
        `/api/delete?fileId=${fileId}`,
        { method: "DELETE" },
        token || undefined,
        clearAuth
      );
      setFiles(files.filter((file) => file.id !== fileId));
      await fetchData(); // Refresh storage data
      toast.success("File deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete file");
    }
  };

  const handleDownload = (cid: string, fileName: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/proxy/${cid}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (!ext) return <LuFile className="h-5 w-5 text-zinc-400" />;

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
      return <LuImage className="h-5 w-5 text-emerald-400" />;
    }
    if (["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(ext)) {
      return <LuVideo className="h-5 w-5 text-red-400" />;
    }
    if (["mp3", "wav", "flac", "aac", "ogg"].includes(ext))
      return <LuMusic className="h-5 w-5 text-purple-400" />;
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext))
      return <LuFileText className="h-5 w-5 text-blue-400" />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
      return <LuArchive className="h-5 w-5 text-orange-400" />;
    return <LuFile className="h-5 w-5 text-zinc-400" />;
  };

  const getFileType = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (!ext) return "unknown";

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
      return "images";
    if (["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(ext))
      return "videos";
    if (["mp3", "wav", "flac", "aac", "ogg"].includes(ext)) return "audio";
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext)) return "documents";
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archives";
    return "other";
  };

  const getFilePreviewUrl = (file: FileData) => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proxy?cid=${file.cid}&filename=${file.fileName}`;
  };

  const filteredAndSortedFiles = files
    .filter((file) => {
      const matchesSearch = file.fileName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterType === "all" || getFileType(file.fileName) === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.fileName.localeCompare(b.fileName);
        case "size":
          return Number(b.size) - Number(a.size);
        case "date":
        default:
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
      }
    });

  const getStorageWarning = () => {
    if (!storageData) return null;
    if (storageData.percentage > 90) return "critical";
    if (storageData.percentage > 80) return "warning";
    return null;
  };

  const getStorageColor = () => {
    if (!storageData) return "bg-gradient-to-r from-zinc-600 to-zinc-500";
    if (storageData.percentage > 90)
      return "bg-gradient-to-r from-red-500 to-red-600";
    if (storageData.percentage > 80)
      return "bg-gradient-to-r from-amber-500 to-amber-600";
    if (storageData.percentage > 60)
      return "bg-gradient-to-r from-blue-500 to-blue-600";
    return "bg-gradient-to-r from-emerald-500 to-emerald-600";
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
            {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div> */}
          </div>
          <Navbar />
          <section className="relative container mx-auto px-4 py-16">
            <div className="space-y-8">
              <div className="text-center">
                <Skeleton className="h-16 w-80 mx-auto mb-4 bg-zinc-800/50" />
                <Skeleton className="h-6 w-96 mx-auto bg-zinc-800/50" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-40 bg-zinc-800/50 rounded-xl"
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-56 bg-zinc-800/50 rounded-xl"
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
        <Navbar />
        <section className="relative container mx-auto px-4 py-16 z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <div className="p-4 bg-zinc-800 rounded-2xl shadow-lg border border-blue-700/40">
                  <LuActivity className="h-10 w-10 text-blue-400 drop-shadow" />
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-100 drop-shadow-lg">
                  Dashboard
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium"
              >
                Manage your files and monitor storage with powerful analytics
              </motion.p>
            </div>
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center gap-4 mb-12"
            >
              <Link href="/upload">
                <Button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-blue-700/40 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300">
                  <LuUpload className="h-5 w-5 mr-2 text-blue-400" />
                  Upload Files
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg"
              >
                <LuRefreshCw
                  className={`h-5 w-5 mr-2 text-blue-400 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </motion.div>
            {/* Storage Overview */}
            {storageData && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
              >
                {/* Storage Card */}
                <Card className="bg-zinc-900 border border-blue-800/40 shadow-xl rounded-2xl col-span-1 md:col-span-2">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-zinc-800 rounded-xl shadow-lg border border-blue-700/40">
                          <LuHardDrive className="h-7 w-7 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400 font-medium">
                            Storage Usage
                          </p>
                          <p className="text-3xl font-bold text-zinc-100">
                            {formatBytes(storageData.used)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-zinc-400">
                          of {formatBytes(storageData.limit)}
                        </p>
                        <p className="text-lg font-semibold text-zinc-200">
                          {storageData.percentage.toFixed(1)}% used
                        </p>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="relative w-full h-5 rounded-full bg-zinc-800 overflow-hidden border border-blue-700/40 shadow-inner">
                      <motion.div
                        className="absolute left-0 top-0 h-full bg-blue-700"
                        initial={{ width: 0 }}
                        animate={{ width: `${storageData.percentage}%` }}
                        transition={{ duration: 2, delay: 1 }}
                      />
                      <div className="absolute inset-0 flex justify-between text-xs text-zinc-400 px-3 h-full items-center">
                        <span>0%</span>
                        <span>{storageData.percentage.toFixed(1)}% used</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Plan Card */}
                <Card className="bg-zinc-900 border border-purple-800/40 shadow-xl rounded-2xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-4 bg-zinc-800 rounded-xl shadow-lg border border-purple-700/40">
                        <LuZap className="h-7 w-7 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400 font-medium">
                          Current Plan
                        </p>
                        <p className="text-2xl font-bold text-zinc-100 capitalize">
                          {storageData.tier}
                        </p>
                      </div>
                    </div>
                    <Link href="/subscription">
                      <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-purple-700/40 font-semibold py-3 rounded-xl shadow-lg">
                        <LuTrendingUp className="h-4 w-4 mr-2 text-purple-400" />
                        Upgrade Plan
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {/* Storage Warning */}
            <AnimatePresence>
              {getStorageWarning() && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <Card
                    className={`${
                      getStorageWarning() === "critical"
                        ? "bg-red-950 border-red-500/60"
                        : "bg-amber-950 border-amber-500/60"
                    } shadow-xl rounded-2xl border backdrop-blur-xl`}
                  >
                    <CardContent className="p-6 flex items-center gap-4">
                      <div
                        className={`p-4 rounded-xl shadow-lg ${
                          getStorageWarning() === "critical"
                            ? "bg-red-900 border border-red-500/30"
                            : "bg-amber-900 border border-amber-500/30"
                        }`}
                      >
                        <LuShield
                          className={`h-7 w-7 drop-shadow ${
                            getStorageWarning() === "critical"
                              ? "text-red-400"
                              : "text-amber-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold text-lg ${
                            getStorageWarning() === "critical"
                              ? "text-red-300"
                              : "text-amber-300"
                          }`}
                        >
                          {getStorageWarning() === "critical"
                            ? "Storage Critical"
                            : "Storage Warning"}
                        </h3>
                        <p className="text-zinc-300 mt-1">
                          {getStorageWarning() === "critical"
                            ? "Your storage is almost full. Upgrade your plan or delete files to continue uploading."
                            : "You're running low on storage space. Consider upgrading your plan."}
                        </p>
                      </div>
                      <Link href="/subscription">
                        <Button
                          className={`${
                            getStorageWarning() === "critical"
                              ? "bg-red-700 hover:bg-red-600"
                              : "bg-amber-700 hover:bg-amber-600"
                          } text-white font-semibold px-6 py-3 rounded-xl shadow-lg`}
                        >
                          Upgrade Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            >
              <Card className="bg-zinc-900 border border-blue-700/50 rounded-2xl shadow-lg">
                <CardContent className="p-6 text-center">
                  <LuFile className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-zinc-100">
                    {files.length}
                  </p>
                  <p className="text-sm text-zinc-400">Total Files</p>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border border-emerald-700/50 rounded-2xl shadow-lg">
                <CardContent className="p-6 text-center">
                  <LuImage className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-zinc-100">
                    {
                      files.filter((f) => getFileType(f.fileName) === "images")
                        .length
                    }
                  </p>
                  <p className="text-sm text-zinc-400">Images</p>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border border-blue-700/50 rounded-2xl shadow-lg">
                <CardContent className="p-6 text-center">
                  <LuFileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-zinc-100">
                    {
                      files.filter(
                        (f) => getFileType(f.fileName) === "documents"
                      ).length
                    }
                  </p>
                  <p className="text-sm text-zinc-400">Documents</p>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border border-purple-700/50 rounded-2xl shadow-lg">
                <CardContent className="p-6 text-center">
                  <LuCloud className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-zinc-100">
                    {files.filter((f) => f.paid).length}
                  </p>
                  <p className="text-sm text-zinc-400">Stored</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Files Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Card className="bg-zinc-900 border border-blue-700/50 rounded-2xl shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-zinc-800 rounded-xl shadow-lg border border-blue-700/40">
                      <LuFolderOpen className="h-7 w-7 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-zinc-100 drop-shadow-lg">
                        Your Files
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        Manage and organize your uploaded files
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="relative">
                      <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full md:w-72 bg-zinc-800/50 border-zinc-600/50 text-zinc-100 placeholder-zinc-400 rounded-xl"
                      />
                    </div>

                    {/* Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-zinc-600/50 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 rounded-xl"
                        >
                          <LuFilter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-zinc-800 border-zinc-700 rounded-xl">
                        <DropdownMenuItem
                          onClick={() => setFilterType("all")}
                          className="text-zinc-300 hover:bg-zinc-700"
                        >
                          All Files
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setFilterType("images")}
                          className="text-zinc-300 hover:bg-zinc-700"
                        >
                          Images
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setFilterType("documents")}
                          className="text-zinc-300 hover:bg-zinc-700"
                        >
                          Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setFilterType("videos")}
                          className="text-zinc-300 hover:bg-zinc-700"
                        >
                          Videos
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setFilterType("audio")}
                          className="text-zinc-300 hover:bg-zinc-700"
                        >
                          Audio
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setFilterType("archives")}
                          className="text-zinc-300 hover:bg-zinc-700"
                        >
                          Archives
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Sort */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-zinc-600/50 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 rounded-xl"
                        >
                          <LuCalendar className="h-4 w-4 mr-2" />
                          Sort
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-zinc-800 border-zinc-700 rounded-xl">
                        <DropdownMenuItem
                          onClick={() => setSortBy("date")}
                          className="text-zinc-300 hover:bg-zinc-700"
                        >
                          Date
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSortBy("name")}
                          className="text-zinc-300 hover:bg-zinc-700"
                        >
                          Name
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSortBy("size")}
                          className="text-zinc-300 hover:bg-zinc-700"
                        >
                          Size
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* View Mode */}
                    <div className="flex border border-zinc-600/50 rounded-xl bg-zinc-800/50">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={`rounded-l-xl rounded-r-none ${
                          viewMode === "grid"
                            ? "bg-zinc-700 text-zinc-100"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                        }`}
                      >
                        <LuGrid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={`rounded-r-xl rounded-l-none ${
                          viewMode === "list"
                            ? "bg-zinc-700 text-zinc-100"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                        }`}
                      >
                        <LuList className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {filteredAndSortedFiles.length === 0 ? (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <LuFile className="h-16 w-16 text-zinc-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-zinc-100 mb-2">
                      No files found
                    </h3>
                    <p className="text-zinc-400 mb-6">
                      {searchTerm || filterType !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "Upload your first file to get started"}
                    </p>
                    <Link href="/upload">
                      <Button className="bg-zinc-700 hover:bg-zinc-600 border border-zinc-600/50 text-zinc-100 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <LuUpload className="h-5 w-5 mr-2" />
                        Upload File
                      </Button>
                    </Link>
                  </motion.div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAndSortedFiles.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <Card className="bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-zinc-600">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="p-4 bg-zinc-800 rounded-2xl">
                                {getFileIcon(file.fileName)}
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                                  >
                                    <LuEye className="h-5 w-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-zinc-800 border-zinc-700 rounded-xl">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setPreviewFile(file);
                                      setPreviewOpen(true);
                                    }}
                                    className="text-zinc-300 hover:bg-zinc-700"
                                  >
                                    <LuEye className="h-4 w-4 mr-2" />
                                    Preview
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDownload(file.cid, file.fileName)
                                    }
                                    className="text-zinc-300 hover:bg-zinc-700"
                                  >
                                    <LuDownload className="h-4 w-4 mr-2" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(file.id)}
                                    className="text-red-400 hover:bg-zinc-700 hover:text-red-300"
                                  >
                                    <LuTrash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="space-y-2">
                              <h3
                                className="font-medium text-base text-zinc-100 truncate"
                                title={file.fileName}
                              >
                                {file.fileName}
                              </h3>
                              <div className="flex items-center justify-between text-xs text-zinc-400">
                                <span>{formatBytes(file.size)}</span>
                                <Badge
                                  variant="outline"
                                  className="border-zinc-600 text-zinc-300 bg-zinc-800/50"
                                >
                                  {file.paid ? "Stored" : "Pending"}
                                </Badge>
                              </div>
                              <p className="text-xs text-zinc-500">
                                {new Date(file.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredAndSortedFiles.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className="flex items-center justify-between p-4 bg-zinc-900/80 rounded-2xl border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {getFileIcon(file.fileName)}
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-medium text-zinc-100 truncate"
                              title={file.fileName}
                            >
                              {file.fileName}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-zinc-400 mt-1">
                              <span>{formatBytes(file.size)}</span>
                              <span>
                                {new Date(file.timestamp).toLocaleDateString()}
                              </span>
                              <Badge
                                variant="outline"
                                className="border-zinc-600 text-zinc-300 bg-zinc-800/50"
                              >
                                {file.paid ? "Stored" : "Pending"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDownload(file.cid, file.fileName)
                            }
                            className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                          >
                            <LuDownload className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(file.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                          >
                            <LuTrash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          {/* File Preview Modal */}
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogContent className="bg-zinc-950 border border-blue-700/70 shadow-2xl max-w-2xl w-full mx-auto rounded-2xl overflow-hidden p-0">
              <div className="flex flex-col items-center justify-center min-h-[400px] p-8 relative">
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="absolute top-4 right-4 z-20 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full p-2 shadow-lg"
                  aria-label="Close preview"
                >
                  <LuX className="h-5 w-5" />
                </button>
                {previewFile && (
                  <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
                    <DialogHeader className="mb-4 w-full text-center">
                      <DialogTitle className="text-2xl text-blue-400 font-bold">
                        File Preview
                      </DialogTitle>
                    </DialogHeader>
                    {getFileType(previewFile.fileName) === "images" ? (
                      <img
                        src={getFilePreviewUrl(previewFile)}
                        alt={previewFile.fileName}
                        className="rounded-xl max-h-96 mx-auto mb-4 border border-zinc-800 shadow-lg"
                      />
                    ) : getFileType(previewFile.fileName) === "videos" ? (
                      <video
                        src={getFilePreviewUrl(previewFile)}
                        controls
                        className="rounded-xl max-h-96 mx-auto mb-4 border border-zinc-800 shadow-lg"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="mb-4 text-zinc-300 text-center">
                        <p>
                          <span className="font-semibold">Name:</span>{" "}
                          {previewFile.fileName}
                        </p>
                        <p>
                          <span className="font-semibold">Size:</span>{" "}
                          {formatBytes(previewFile.size)}
                        </p>
                        <p>
                          <span className="font-semibold">CID:</span>{" "}
                          <span className="font-mono text-xs break-all">
                            {previewFile.cid}
                          </span>
                        </p>
                        <p className="mt-2 text-zinc-500">
                          No preview available for this file type.
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4 justify-center w-full">
                      <Button
                        onClick={() =>
                          handleDownload(previewFile.cid, previewFile.fileName)
                        }
                        className="bg-blue-700 hover:bg-blue-800 text-white border border-blue-800 font-semibold rounded-xl shadow-lg"
                      >
                        <LuDownload className="h-4 w-4 mr-2 text-white" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </section>
      </div>
    </AuthGuard>
  );
}
