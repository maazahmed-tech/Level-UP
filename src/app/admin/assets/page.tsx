"use client";

import { useState, useRef } from "react";

interface Asset {
  id: number;
  filename: string;
  type: string;
  size: string;
  uploaded: string;
  url: string;
}

const MOCK_ASSETS: Asset[] = [
  { id: 1, filename: "hero-banner.jpg", type: "image", size: "2.4 MB", uploaded: "2026-03-15", url: "/images/hero-banner.jpg" },
  { id: 2, filename: "transformation-mark.jpg", type: "image", size: "1.8 MB", uploaded: "2026-03-12", url: "/images/transformation-mark.jpg" },
  { id: 3, filename: "transformation-sarah.jpg", type: "image", size: "1.6 MB", uploaded: "2026-03-12", url: "/images/transformation-sarah.jpg" },
  { id: 4, filename: "logo.svg", type: "image", size: "12 KB", uploaded: "2026-02-01", url: "/images/logo.svg" },
  { id: 5, filename: "og-image.png", type: "image", size: "856 KB", uploaded: "2026-02-01", url: "/images/og-image.png" },
  { id: 6, filename: "raheel-about.jpg", type: "image", size: "3.1 MB", uploaded: "2026-01-20", url: "/images/raheel-about.jpg" },
  { id: 7, filename: "recipe-pancakes.jpg", type: "image", size: "980 KB", uploaded: "2026-03-01", url: "/images/recipe-pancakes.jpg" },
  { id: 8, filename: "recipe-wrap.jpg", type: "image", size: "1.1 MB", uploaded: "2026-03-01", url: "/images/recipe-wrap.jpg" },
];

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Mock upload
    setTimeout(() => {
      const newAsset: Asset = {
        id: Date.now(),
        filename: file.name,
        type: "image",
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploaded: new Date().toISOString().split("T")[0],
        url: `/images/${file.name}`,
      };
      setAssets((prev) => [newAsset, ...prev]);
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1000);
  }

  function handleDelete(id: number) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }

  function handleCopyUrl(asset: Asset) {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Assets</h1>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer border-none disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "+ Upload Asset"}
          </button>
        </div>
      </div>

      <p className="text-sm text-white/50">{assets.length} assets</p>

      {/* Grid of asset cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-[#1E1E1E] rounded-2xl shadow-card overflow-hidden flex flex-col">
            {/* Preview placeholder */}
            <div className="h-36 bg-dark/5 flex items-center justify-center">
              <span className="text-4xl opacity-30">{"\uD83D\uDDBC"}</span>
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1">
              <p className="font-medium text-sm text-white truncate" title={asset.filename}>
                {asset.filename}
              </p>
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span>{asset.size}</span>
                <span>{formatDate(asset.uploaded)}</span>
              </div>

              <div className="flex gap-2 mt-auto pt-2">
                <button
                  onClick={() => handleCopyUrl(asset)}
                  className="flex-1 text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors cursor-pointer border-none"
                >
                  {copiedId === asset.id ? "Copied!" : "Copy URL"}
                </button>
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors cursor-pointer border-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
