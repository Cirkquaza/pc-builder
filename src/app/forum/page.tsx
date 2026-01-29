"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, ThumbsUp, ThumbsDown, X, Trash2 } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  comments: number;
  likes: number;
  userId: string;
}

export default function ForumPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
    if (status === "authenticated") {
      fetchTickets();
    }
  }, [status, router]);

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/forum/tickets");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/forum/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        setIsCreateModalOpen(false);
        fetchTickets();
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTicket = async (e: React.MouseEvent, ticketId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Da li si siguran da želiš obrisati ovaj ticket?")) {
      return;
    }

    try {
      const response = await fetch(`/api/forum/tickets/${ticketId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTickets();
      } else {
        alert("Greška pri brisanju ticketa");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("Greška pri brisanju ticketa");
    }
  };

  if (status === "loading") {
    return (
      <div className="text-center text-white py-12">
        <p>Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Forum Zajednice</h1>
        <p className="text-gray-200 mb-6">
          Postavi pitanja, deli iskustva i pomogni drugima sa PC Builder zajednicom
        </p>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-cyan-400 text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-cyan-300 transition"
        >
          + Kreiraj novi Ticket
        </button>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-8 w-full max-w-2xl border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Kreiraj novi Ticket</h2>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-slate-200 mb-2">Naslov</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Naslov tvog pitanja..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-200 mb-2">Opis</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detaljno objasni tvoje pitanje..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-32 resize-none"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-2 rounded-lg transition"
                >
                  {isLoading ? "Prosljeđivanje..." : "Kreiraj Ticket"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Otkaži
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-gray-400 mb-4">Nema ainda ticketa</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-blue-400 hover:text-blue-300"
            >
              Budite prvi koji će postaviti pitanje
            </button>
          </div>
        ) : (
          tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/forum/ticket/${ticket.id}`}
              className="block bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition hover:shadow-lg relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {ticket.title}
                  </h3>
                  <p className="text-slate-400 mb-3 line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>Od: {ticket.author}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString("sr-RS")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-1">
                      <MessageSquare size={18} />
                      <span>{ticket.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={18} />
                      <span>{ticket.likes}</span>
                    </div>
                  </div>
                  {session?.user && (
                    <button
                      onClick={(e) => handleDeleteTicket(e, ticket.id)}
                      className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition p-2 rounded hover:bg-red-500/10"
                      title="Obriši ticket"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
