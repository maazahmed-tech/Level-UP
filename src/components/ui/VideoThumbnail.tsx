"use client";

import { parseVideoUrl, getPlatformLabel } from "@/lib/video";

interface VideoThumbnailProps {
  url: string;
  className?: string;
  height?: string;
}

/**
 * Video thumbnail component for grid displays.
 * Shows YouTube thumbnail or platform icon placeholder for other platforms.
 */
export default function VideoThumbnail({ url, className = "", height = "h-[180px]" }: VideoThumbnailProps) {
  const info = parseVideoUrl(url);

  if (!info) {
    return (
      <div className={`${height} bg-[#2A2A2A] flex items-center justify-center ${className}`}>
        <span className="text-white/20 text-sm">No video</span>
      </div>
    );
  }

  const platform = getPlatformLabel(info.platform);

  // YouTube has thumbnails
  if (info.thumbnailUrl) {
    return (
      <div className={`relative ${height} overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={info.thumbnailUrl}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
        {/* Platform badge */}
        {info.platform !== "youtube" && (
          <div
            className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
            style={{ backgroundColor: platform.color + "CC" }}
          >
            {platform.icon} {platform.name}
          </div>
        )}
        {info.isVertical && (
          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold text-white bg-black/60">
            Short
          </div>
        )}
      </div>
    );
  }

  // Other platforms — show colored placeholder with platform icon
  return (
    <div
      className={`relative ${height} flex flex-col items-center justify-center gap-2 ${className}`}
      style={{ background: `linear-gradient(135deg, ${platform.color}15, ${platform.color}30)` }}
    >
      <span className="text-3xl">{platform.icon}</span>
      <span className="text-xs font-semibold text-white/50">{platform.name}{info.isVertical ? " Reel" : ""}</span>
      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
