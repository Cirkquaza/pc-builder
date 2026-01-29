"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Send, Star, Trash2 } from "lucide-react";

interface SetupComment {
  id: string;
  text: string;
  author: string;
  userId: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  rating?: number;
}

interface SetupDetail {
  id: string;
  title: string;
  description?: string;
  image: string;
  author: string;
  createdAt: string;
  rating: number;
  likes: number;
  dislikes: number;
  comments: SetupComment[];
}

export default function SetupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [setup, setSetup] = useState<SetupDetail | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  useEffect(() => {
    fetchSetup();
  }, [params.id]);

  const fetchSetup = async () => {
    try {
      const response = await fetch(`/api/setups/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setSetup(data);
      }
    } catch (error) {
      console.error("Error fetching setup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!status) return;

    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/setups/${params.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment }),
      });

      if (response.ok) {
        setNewComment("");
        fetchSetup();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    try {
      await fetch(`/api/setups/${params.id}/comments/${commentId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "like" }),
      });
      fetchSetup();
    } catch (error) {
      console.error("Error liking:", error);
    }
  };

  const handleDislike = async (commentId: string) => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    try {
      await fetch(`/api/setups/${params.id}/comments/${commentId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "dislike" }),
      });
      fetchSetup();
    } catch (error) {
      console.error("Error disliking:", error);
    }
  };

  const handleRating = async (commentId: string, rating: number) => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    try {
      await fetch(`/api/setups/${params.id}/comments/${commentId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      fetchSetup();
    } catch (error) {
      console.error("Error rating:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Da li si siguran da želiš obrisati ovaj komentar?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/setups/${params.id}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchSetup();
      } else {
        alert("Greška pri brisanju komentara");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Greška pri brisanju komentara");
    }
  };

  if (isLoading) {
    return <div className="text-center text-white py-12">Učitavanje...</div>;
  }

  if (!setup) {
    return (
      <div className="text-center text-white py-12">
        <p>Setup nije pronađen</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Setup Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg overflow-hidden border border-slate-700">
        <img
          src={setup.image}
          alt={setup.title}
          className="w-full max-h-96 object-cover"
        />
        <div className="p-8 text-white">
          <button
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300 mb-4"
          >
            ← Nazad
          </button>
          <h1 className="text-4xl font-bold mb-2">{setup.title}</h1>
          <p className="text-gray-300 mb-4">{setup.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span>Autor: {setup.author}</span>
            <span>{new Date(setup.createdAt).toLocaleDateString("sr-RS")}</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Mišljenja ({setup.comments.length})</h2>

        {setup.comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Nema mišljenja još uvijek</p>
        ) : (
          <div className="space-y-4">
            {setup.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">{comment.author}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString("sr-RS")}
                    </p>
                  </div>
                  {session?.user && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-500/10"
                      title="Obriši komentar"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <p className="text-gray-200 mb-4">{comment.text}</p>

                {/* Rating */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => {
                      const starValue = (i + 1) * 1.0;
                      const displayValue = Math.round((comment.rating ?? 0) * 2) / 2;
                      const isFilled = starValue <= displayValue;

                      return (
                        <button
                          key={i}
                          onClick={() => handleRating(comment.id, starValue)}
                          onMouseEnter={() => setHoveredRating(starValue)}
                          onMouseLeave={() => setHoveredRating(null)}
                          className="transition-transform hover:scale-125"
                        >
                          <Star
                            size={20}
                            className={`${
                              hoveredRating && starValue <= hoveredRating
                                ? "fill-yellow-400 text-yellow-400"
                                : isFilled
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-500"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-sm text-gray-400">
                    {(comment.rating ?? 0).toFixed(1)}/10.0
                  </span>
                </div>

                {/* Like/Dislike */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition"
                  >
                    <ThumbsUp size={18} />
                    <span className="text-sm">{comment.likes}</span>
                  </button>
                  <button
                    onClick={() => handleDislike(comment.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition"
                  >
                    <ThumbsDown size={18} />
                    <span className="text-sm">{comment.dislikes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Form */}
      {status === "authenticated" ? (
        <form onSubmit={handlePostComment} className="space-y-4">
          <label className="block text-slate-200">Dodaj mišljenje</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Šta mislite o ovom setupu? Koje komponente koristi? Preporuke?"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            <Send size={18} />
            {isSubmitting ? "Slanje..." : "Objavi mišljenje"}
          </button>
        </form>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-300 mb-4">Trebate biti prijavljeni da biste ostavili mišljenje</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Prijava
          </button>
        </div>
      )}
    </div>
  );
}
