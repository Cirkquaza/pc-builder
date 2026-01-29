"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Upload, X, Trash2 } from "lucide-react";

interface Setup {
  id: string;
  userId: string;
  title: string;
  description?: string;
  image: string;
  author: string;
  createdAt: string;
  rating: number;
  likes: number;
  dislikes: number;
  commentCount: number;
}

export default function SetupsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [setups, setSetups] = useState<Setup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [preview, setPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSetups();
  }, []);

  const fetchSetups = async () => {
    try {
      const response = await fetch("/api/setups");
      if (response.ok) {
        const data = await response.json();
        setSetups(data);
      }
    } catch (error) {
      console.error("Error fetching setups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Samo JPG, PNG i WebP slike su dozvoljene");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Slika mora biti manja od 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData({ ...formData, image: result });
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!status) return;

    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (!formData.title.trim() || !formData.image) {
      alert("Naslov i slika su obavezni");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/setups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          image: formData.image,
        }),
      });

      if (response.ok) {
        setFormData({ title: "", description: "", image: "" });
        setPreview("");
        setShowModal(false);
        fetchSetups();
      } else {
        alert("Greška pri objavljivanju setupa");
      }
    } catch (error) {
      console.error("Error submitting setup:", error);
      alert("Greška pri objavljivanju");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSetup = async (e: React.MouseEvent, setupId: string) => {
    e.stopPropagation();

    if (!confirm("Da li si siguran da želiš obrisati ovaj setup?")) {
      return;
    }

    try {
      const response = await fetch(`/api/setups/${setupId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSetups();
      } else {
        alert("Greška pri brisanju setupa");
      }
    } catch (error) {
      console.error("Error deleting setup:", error);
      alert("Greška pri brisanju setupa");
    }
  };

  if (isLoading) {
    return <div className="text-center text-white py-12">Učitavanje...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-8 text-white border border-slate-700">
        <h1 className="text-4xl font-bold mb-4">⚡ PC Setups Galerija</h1>
        <p className="text-gray-200">
          Pogledaj setupe od drugih korisnika, ocijeni ih i daj povratnu informaciju
        </p>
      </div>

      {/* Create Setup Button */}
      {status === "authenticated" && (
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          + Objavi svoj setup
        </button>
      )}

      {/* Setup Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Objavi svoj setup</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Naslov
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="npr. Gaming Setup 2026"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Opis (opciono)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Opiši svoj setup, komponente, performanse itd..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
                />
              </div>

              {/* Image Preview */}
              {preview && (
                <div>
                  <p className="text-white font-semibold mb-2">Pregled:</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded-lg"
                  />
                </div>
              )}

              {/* Image Upload */}
              <label className="block">
                <div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-gray-200">Klikni ili povuci sliku</p>
                    <p className="text-sm text-gray-400">JPG, PNG (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageSelect}
                  />
                </div>
              </label>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.image}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  {isSubmitting ? "Objavljivanje..." : "Objavi setup"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Otkaži
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Setups Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          {setups.length === 0 ? "Nema objavljenih setupa" : "Svi Setups"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {setups.map((setup) => (
            <div
              key={setup.id}
              onClick={() => router.push(`/setups/${setup.id}`)}
              className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500 transition cursor-pointer relative group"
            >
              {/* Image */}
              <img
                src={setup.image}
                alt={setup.title}
                className="w-full h-48 object-cover"
              />

              {/* Delete Button */}
              {session?.user && (
                <button
                  onClick={(e) => handleDeleteSetup(e, setup.id)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-300 bg-black/70 p-2 rounded opacity-0 group-hover:opacity-100 transition"
                  title="Obriši setup"
                >
                  <Trash2 size={18} />
                </button>
              )}

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-bold text-white">{setup.title}</h3>

                <div className="flex items-center justify-between text-sm text-gray-300">
                  <span>{setup.author}</span>
                  <span>{new Date(setup.createdAt).toLocaleDateString("sr-RS")}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-400 border-t border-slate-700 pt-3">
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    <span>{setup.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💬</span>
                    <span>{setup.commentCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👍</span>
                    <span>{setup.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
