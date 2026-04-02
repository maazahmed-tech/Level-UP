"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Post {
  id: number;
  content: string;
  mediaType: string | null;
  mediaUrl: string | null;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

export default function AdminFeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [mediaType, setMediaType] = useState<"none" | "youtube" | "image">("none");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/feed");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handlePost() {
    if (!content.trim()) return;
    setPosting(true);

    let finalMediaType: string | null = null;
    let finalMediaUrl: string | null = null;

    if (mediaType === "youtube" && youtubeUrl.trim()) {
      finalMediaType = "youtube";
      finalMediaUrl = youtubeUrl.trim();
    } else if (mediaType === "image" && imagePreview) {
      finalMediaType = "image";
      finalMediaUrl = imagePreview;
    }

    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          mediaType: finalMediaType,
          mediaUrl: finalMediaUrl,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPosts((prev) => [data.post, ...prev]);
        setContent("");
        setMediaType("none");
        setYoutubeUrl("");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Failed to post:", err);
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(postId: number) {
    if (!confirm("Delete this post?")) return;
    setDeleting(postId);
    try {
      const res = await fetch(`/api/feed/${postId}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeleting(null);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Social Feed</h1>
        <p className="text-sm text-white/50 mt-1">
          Create and manage posts for your clients
        </p>
      </div>

      {/* Create post */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
          New Post
        </h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post..."
          rows={4}
          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E51A1A] transition-colors resize-none"
        />

        <div className="flex items-center gap-3">
          <label className="text-white/50 text-sm">Media:</label>
          <select
            value={mediaType}
            onChange={(e) => {
              setMediaType(e.target.value as "none" | "youtube" | "image");
              setYoutubeUrl("");
              setImagePreview(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E51A1A] transition-colors"
          >
            <option value="none">None</option>
            <option value="youtube">YouTube Video</option>
            <option value="image">Image Upload</option>
          </select>
        </div>

        {mediaType === "youtube" && (
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E51A1A] transition-colors"
          />
        )}

        {mediaType === "image" && (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2A2A2A] file:text-white hover:file:bg-[#3A3A3A] file:cursor-pointer"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-[200px] rounded-lg"
              />
            )}
          </div>
        )}

        <button
          onClick={handlePost}
          disabled={!content.trim() || posting}
          className="px-6 py-3 bg-[#E51A1A] text-white rounded-xl text-sm font-semibold hover:bg-[#E51A1A]/90 transition-colors cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Posts list */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-white/30 py-8">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-8 text-center">
            <p className="text-white/50">No posts yet. Create your first post above.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 text-sm whitespace-pre-wrap line-clamp-3">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {post.mediaType && (
                      <span className="text-[10px] bg-[#FF6B00]/20 text-[#FF6B00] px-2 py-0.5 rounded-full font-semibold uppercase">
                        {post.mediaType}
                      </span>
                    )}
                    <span className="text-white/30 text-xs flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      {post.likeCount}
                    </span>
                    <span className="text-white/30 text-xs flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                      </svg>
                      {post.commentCount}
                    </span>
                    <span className="text-white/20 text-xs">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deleting === post.id}
                  className="px-3 py-1.5 text-xs text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors bg-transparent border border-red-500/30 cursor-pointer disabled:opacity-40"
                >
                  {deleting === post.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
