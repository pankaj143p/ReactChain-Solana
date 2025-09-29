"use client";

import type React from "react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  LuUpload,
  LuFile,
  LuCheck,
  LuX,
  LuRefreshCw,
  LuCloud,
  LuShield,
  LuZap,
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
import { Progress } from "@repo/ui/components/ui/progress";
import { Badge } from "@repo/ui/components/ui/badge";
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

interface UploadedFile {
  id: number;
  fileName: string;
  size: number;
  cid: string;
}

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token, clearAuth } = useAuthStore();
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      // Check file type
      const ext = file.name.split(".").pop()?.toLowerCase();
      const allowed = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "svg",
        "mp4",
        "avi",
        "mov",
        "wmv",
        "flv",
        "webm",
        "mp3",
        "wav",
        "flac",
        "aac",
        "ogg",
        "pdf",
        "doc",
        "docx",
        "txt",
        "rtf",
        "zip",
        "rar",
        "7z",
        "tar",
        "gz",
      ];
      if (!ext || !allowed.includes(ext)) {
        toast.error(
          "Unsupported file format. Please upload an image, video, audio, document, or archive."
        );
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || uploading) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      setUploadProgress(20);
      toast.loading("Uploading file...");

      const response = await apiFetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        },
        token ?? undefined,
        clearAuth
      );

      setUploadProgress(60);
      const data = await response.data;

      setUploadProgress(100);
      toast.dismiss();
      toast.success("File uploaded successfully!");

      // Add to uploaded files list
      const newFile: UploadedFile = {
        id: data.file?.id || data.fileId,
        fileName: data.file?.fileName || selectedFile.name,
        size: Number(data.file?.size) || selectedFile.size,
        cid: data.file?.cid || data.cid,
      };
      setUploadedFiles((prev) => [newFile, ...prev]);

      // Reset form
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast.dismiss();
      if (error.message.includes("Storage limit exceeded")) {
        toast.error("Storage limit exceeded! Please upgrade your plan.");
      } else {
        toast.error(error.message || "Upload failed");
      }
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return <LuFile className="h-5 w-5 text-zinc-300" />;
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
  const getFilePreviewUrl = (file: UploadedFile) => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proxy?cid=${file.cid}&filename=${file.fileName}`;
  };

  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
        {/* Background Pattern */}
        <div className="absolute inset-0" />
        <Navbar />
        <section className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-blue-700/40 rounded-full mb-6 shadow">
              <LuCloud className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-zinc-300">
                Decentralized Storage
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-zinc-100">
              Upload Files
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Securely store your files on the decentralized web with{" "}
              <span className="text-blue-400 font-medium">IPFS</span>
            </p>
          </motion.div>
          {/* Features Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 bg-zinc-900 border border-blue-700/40 rounded-xl shadow">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  <LuShield className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-200">Secure</h3>
                  <p className="text-sm text-zinc-400">End-to-end encryption</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-zinc-900 border border-emerald-700/40 rounded-xl shadow">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  <LuZap className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-200">Fast</h3>
                  <p className="text-sm text-zinc-400">Lightning uploads</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-zinc-900 border border-purple-700/40 rounded-xl shadow">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  <LuCloud className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-200">Permanent</h3>
                  <p className="text-sm text-zinc-400">Stored forever</p>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Upload Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-zinc-900 border border-blue-700/40 shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl text-zinc-100">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                      <LuUpload className="h-6 w-6 text-blue-400" />
                    </div>
                    Upload File
                  </CardTitle>
                  <CardDescription className="text-zinc-400 text-base">
                    Choose a file to upload to IPFS. Maximum file size: 10MB
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* File Input */}
                  <div className="space-y-3">
                    <label
                      htmlFor="file-upload"
                      className="text-sm font-medium text-zinc-300"
                    >
                      Select File
                    </label>
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        onChange={handleFileSelect}
                        className="w-full p-4 border-2 border-dashed border-blue-700/40 hover:border-blue-600 rounded-xl bg-zinc-900 text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-700 file:text-white hover:file:bg-blue-800 transition-all duration-200"
                        disabled={uploading}
                      />
                      {!selectedFile && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                            <LuCloud className="h-12 w-12 text-zinc-600 mx-auto mb-2" />
                            <p className="text-zinc-500 text-sm">
                              Drag and drop or click to select
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Selected File Preview */}
                  {selectedFile && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-zinc-800 rounded-xl border border-blue-700/40"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-zinc-900 rounded-lg">
                            {getFileIcon(selectedFile.name)}
                          </div>
                          <div>
                            <p className="font-medium text-zinc-200">
                              {selectedFile.name}
                            </p>
                            <p className="text-sm text-zinc-400">
                              {formatFileSize(selectedFile.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedFile(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          disabled={uploading}
                          className="hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200"
                        >
                          <LuX className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  {/* Upload Progress */}
                  {uploading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-300">
                          Uploading to IPFS...
                        </span>
                        <span className="text-blue-400 font-medium">
                          {uploadProgress}%
                        </span>
                      </div>
                      <Progress
                        value={uploadProgress}
                        className="h-3 bg-zinc-800"
                      />
                    </motion.div>
                  )}
                  {/* Upload Button */}
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-xl border border-blue-800 transition-all duration-200 shadow-lg"
                  >
                    {uploading ? (
                      <>
                        <LuRefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Uploading to IPFS...
                      </>
                    ) : (
                      <>
                        <LuUpload className="h-5 w-5 mr-2" />
                        Upload File
                      </>
                    )}
                  </Button>
                  {/* Info */}
                  <div className="bg-zinc-800 rounded-xl p-4 border border-blue-700/40">
                    <div className="text-sm text-zinc-400 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <span>Files are stored permanently on IPFS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        <span>No payment required for uploads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        <span>
                          Storage limits apply based on your subscription plan
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {/* Recently Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Card className="bg-zinc-900 border border-blue-700/40 shadow-xl">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl text-zinc-100">
                      <div className="p-2 bg-zinc-800 rounded-lg">
                        <LuCheck className="h-5 w-5 text-green-400" />
                      </div>
                      Recently Uploaded
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      Files uploaded in this session
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {uploadedFiles.map((file, index) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl border border-blue-700/40 hover:border-blue-500 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-900 rounded-lg">
                              {getFileIcon(file.fileName)}
                            </div>
                            <div>
                              <p className="font-medium text-zinc-200">
                                {file.fileName}
                              </p>
                              <p className="text-sm text-zinc-400">
                                {formatFileSize(file.size)} • CID:{" "}
                                {file.cid.slice(0, 12)}...
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-700/40 text-blue-400 hover:bg-zinc-900"
                              onClick={() => {
                                setPreviewFile(file);
                                setPreviewOpen(true);
                              }}
                            >
                              Preview
                            </Button>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
                              <LuCheck className="h-3 w-3 mr-1" />
                              Uploaded
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex gap-4 justify-center"
            >
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-blue-700/40 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 hover:border-blue-600"
                >
                  View All Files
                </Button>
              </Link>
              <Link href="/subscription">
                <Button
                  variant="outline"
                  className="border-blue-700/40 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 hover:border-blue-600"
                >
                  Upgrade Storage
                </Button>
              </Link>
            </motion.div>
          </div>
          {/* File Preview Modal */}
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogContent className="bg-zinc-900 border border-blue-700/40">
              {previewFile && (
                <>
                  <DialogHeader>
                    <DialogTitle>File Preview</DialogTitle>
                  </DialogHeader>
                  {getFileType(previewFile.fileName) === "images" ? (
                    <img
                      src={getFilePreviewUrl(previewFile)}
                      alt={previewFile.fileName}
                      className="rounded-xl max-h-96 mx-auto mb-4 border border-zinc-800"
                    />
                  ) : (
                    <div className="mb-4 text-zinc-300">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {previewFile.fileName}
                      </p>
                      <p>
                        <span className="font-semibold">Size:</span>{" "}
                        {formatFileSize(previewFile.size)}
                      </p>
                      <p>
                        <span className="font-semibold">CID:</span>{" "}
                        <span className="font-mono text-xs break-all">
                          {previewFile.cid}
                        </span>
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => {
                        const url = getFilePreviewUrl(previewFile);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = previewFile.fileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-blue-700/40 font-semibold rounded-xl"
                    >
                      Download
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </section>
      </div>
    </AuthGuard>
  );
}
