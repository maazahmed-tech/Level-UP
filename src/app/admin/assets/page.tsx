"use client";

import { useState, useEffect, useRef } from "react";

interface Asset {
  id: number;
  filename: string;
  data: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/assets");
      const data = await res.json();
      setAssets(data.assets || []);
    } catch {
      console.error("Failed to fetch assets");
    }
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        await fetch("/api/admin/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            data: base64,
            fileSize: file.size,
            mimeType: file.type,
          }),
        });
        setUploading(false);
        fetchAssets();
      };
      reader.readAsDataURL(file);
    } catch {
      alert("Upload failed");
      setUploading(false);
    }
    // Reset file input
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this asset?")) return;
    try {
      await fetch(`/api/admin/assets/${id}`, { method: "DELETE" });
      fetchAssets();
    } catch {
      alert("Failed to delete");
    }
  }

  function copyDataUrl(data: string) {
    navigator.clipboard.writeText(data);
    alert("Copied to clipboard");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Assets</h1>
          <p className="text-sm text-white/50 mt-1">
            {assets.length} files uploaded
          </p>
        </div>
        <label
          className={`px-4 py-2 bg-[#E51A1A] text-white rounded-lg font-medium hover:bg-[#E51A1A]/90 transition cursor-pointer ${
            uploading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {uploading ? "Uploading..." : "+ Upload"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*,application/pdf"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Grid */}
      {assets.length === 0 ? (
        <p className="text-center text-white/40 py-16">
          No assets uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#E51A1A]/30 transition"
            >
              {/* Preview */}
              <div className="aspect-video bg-[#0A0A0A] flex items-center justify-center">
                {asset.mimeType.startsWith("image/") ? (
                  <img
                    src={asset.data}
                    alt={asset.filename}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-white/30">
                    <p className="text-2xl mb-1">
                      {asset.mimeType.includes("pdf") ? "PDF" : "FILE"}
                    </p>
                    <p className="text-xs">{asset.mimeType}</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm text-white font-medium truncate">
                  {asset.filename}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-white/40">
                    {formatBytes(asset.fileSize)}
                  </span>
                  <span className="text-[10px] text-white/40">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => copyDataUrl(asset.data)}
                    className="flex-1 px-2 py-1.5 bg-[#2A2A2A] text-white/70 text-xs rounded-lg hover:bg-[#333] transition"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="px-2 py-1.5 bg-red-900/30 text-red-400 text-xs rounded-lg hover:bg-red-900/50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
