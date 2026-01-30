"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Send, Star, Trash2 } from "lucide-react";

interface TicketDetail {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  rating: number;
  claps: number;
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  author: string;
  userId: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  rating?: number;
  setupImage?: string;
}

export default function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
    if (status === "authenticated") {
      fetchTicket();
    }
  }, [status, router]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/forum/tickets/${params.id}`);
      const data = await response.json();
      setTicket(data);
    } catch (error) {
      console.error("Error fetching ticket:", error);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/forum/tickets/${params.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        setNewComment("");
        fetchTicket();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (messageId: string) => {
    try {
      const response = await fetch(
        `/api/forum/tickets/${params.id}/messages/${messageId}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "like" }),
        }
      );

      if (response.status === 409) {
        alert("Lajk možeš dati samo jednom");
        return;
      }

      if (response.ok) {
        fetchTicket();
      }
    } catch (error) {
      console.error("Error liking:", error);
    }
  };

  const handleDislike = async (messageId: string) => {
    try {
      const response = await fetch(
        `/api/forum/tickets/${params.id}/messages/${messageId}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "dislike" }),
        }
      );

      if (response.status === 409) {
        alert("Dislajk možeš dati samo jednom");
        return;
      }

      if (response.ok) {
        fetchTicket();
      }
    } catch (error) {
      console.error("Error disliking:", error);
    }
  };

  const handleRating = async (messageId: string, rating: number) => {
    try {
      const response = await fetch(
        `/api/forum/tickets/${params.id}/messages/${messageId}/rating`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating }),
        }
      );

      if (response.status === 409) {
        alert("Rejting možeš dati samo jednom");
        return;
      }

      if (response.ok) {
        fetchTicket();
      }
    } catch (error) {
      console.error("Error rating:", error);
    }
  };

  const handleTicketRating = async (rating: number) => {
    try {
      const response = await fetch(`/api/forum/tickets/${params.id}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      if (response.status === 409) {
        alert("Rejting možeš dati samo jednom");
        return;
      }

      if (response.ok) {
        fetchTicket();
      }
    } catch (error) {
      console.error("Error rating ticket:", error);
    }
  };

  const handleClap = async () => {
    try {
      const response = await fetch(`/api/forum/tickets/${params.id}/clap`, {
        method: "POST",
      });

      if (response.status === 409) {
        alert("Tapkanje možeš dati samo jednom");
        return;
      }

      if (response.ok) {
        fetchTicket();
      }
    } catch (error) {
      console.error("Error clapping:", error);
    }
  };

  const handleDeleteComment = async (messageId: string) => {
    if (!confirm("Da li si siguran da želiš obrisati ovaj komentar?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/forum/tickets/${params.id}/messages/${messageId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchTicket();
      } else {
        alert("Greška pri brisanju komentara");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Greška pri brisanju komentara");
    }
  };

  if (!ticket) {
    return (
      <div className="text-center text-white py-12">
        <p>Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Ticket Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-8 text-white border border-slate-700">
        <button
          onClick={() => router.back()}
          className="text-blue-400 hover:text-blue-300 mb-4"
        >
          ← Nazad
        </button>
        <h1 className="text-4xl font-bold mb-4">{ticket.title}</h1>
        <p className="text-gray-200 mb-6">{ticket.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <span>Autor: {ticket.author}</span>
          <span>{new Date(ticket.createdAt).toLocaleDateString("sr-RS")}</span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => {
                const starValue = i + 1;
                const displayValue = Math.round(ticket.rating ?? 0);
                const isFilled = starValue <= displayValue;

                return (
                  <button
                    key={i}
                    onClick={() => handleTicketRating(starValue)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      size={18}
                      className={`${
                        isFilled
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-500"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-sm text-gray-200">
              {(ticket.rating ?? 0).toFixed(1)}/10.0
            </span>
          </div>
          <button
            onClick={handleClap}
            className="flex items-center gap-2 text-gray-200 hover:text-amber-300 transition"
          >
            <span className="text-xl">👏</span>
            <span className="text-sm">{ticket.claps ?? 0}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Komentari</h2>

        {ticket.messages.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Nema komentara još uvek</p>
        ) : (
          <div className="space-y-4">
            {ticket.messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6"
              >
                {msg.setupImage && (
                  <img
                    src={msg.setupImage}
                    alt="Setup"
                    className="w-full max-h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">{msg.author}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(msg.createdAt).toLocaleDateString("sr-RS")}
                    </p>
                  </div>
                  {session?.user && (
                    <button
                      onClick={() => handleDeleteComment(msg.id)}
                      className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-500/10"
                      title="Obriši komentar"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <p className="text-gray-200 mb-4">{msg.content}</p>

                {/* Rating Stars */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => {
                      const starValue = i + 1;
                      const displayValue = Math.round(msg.rating ?? 0);
                      const isFilled = starValue <= displayValue;
                      const isHalf =
                        starValue - 0.5 === displayValue && displayValue % 1 === 0.5;

                      return (
                        <button
                          key={i}
                          onClick={() => handleRating(msg.id, starValue)}
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
                    {(msg.rating ?? 0).toFixed(1)}/10.0
                  </span>
                </div>

                {/* Like/Dislike Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(msg.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition animate-pulse hover:animate-none"
                  >
                    <ThumbsUp size={18} />
                    <span className="text-sm">{msg.likes}</span>
                  </button>
                  <button
                    onClick={() => handleDislike(msg.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition animate-pulse hover:animate-none"
                  >
                    <ThumbsDown size={18} />
                    <span className="text-sm">{msg.dislikes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handlePostComment} className="space-y-4">
        <div>
          <label className="block text-slate-200 mb-2">Dodaj komentar</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Šta mislite o ovom ticketu?"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !newComment.trim()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          <Send size={18} />
          {isLoading ? "Slanje..." : "Pošalji komentar"}
        </button>
      </form>
    </div>
  );
}
