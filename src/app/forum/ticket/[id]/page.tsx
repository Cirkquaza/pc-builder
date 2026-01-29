"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";

interface TicketDetail {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  dislikes: number;
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
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">{msg.author}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(msg.createdAt).toLocaleDateString("sr-RS")}
                    </p>
                  </div>
                </div>
                <p className="text-gray-200 mb-4">{msg.content}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition">
                    <ThumbsUp size={18} />
                    <span className="text-sm">{msg.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition">
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
