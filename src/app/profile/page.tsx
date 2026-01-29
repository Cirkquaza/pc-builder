"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";

interface UserProfile {
  email: string;
  name?: string;
  setupImage?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [setupImage, setSetupImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [userSetup, setUserSetup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserProfile();
    }
  }, [status]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile");
      if (response.ok) {
        const data: UserProfile = await response.json();
        setUserSetup(data.setupImage || null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  if (status === "loading" || isLoading) {
    return <div className="text-center text-white py-12">Učitavanje...</div>;
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage("Samo JPG, PNG i WebP slike su dozvoljene");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Slika mora biti manja od 5MB");
      return;
    }

    setSetupImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!setupImage) {
      setMessage("Molimo izaberite sliku");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", setupImage);

      // For now, store as base64 in database
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(setupImage);
      });

      const response = await fetch("/api/auth/upload-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setupImage: base64 }),
      });

      if (response.ok) {
        setMessage("Slika je uspješno učitana!");
        setSetupImage(null);
        setPreview("");
        fetchUserProfile(); // Refresh user data
      } else {
        setMessage("Greška pri učitavanju slike");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Greška pri učitavanju slike");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-8 text-white border border-slate-700">
        <h1 className="text-4xl font-bold mb-4">Moj profil</h1>
        <p className="text-gray-200">Email: {session?.user?.email}</p>
        <p className="text-gray-300">Ime: {session?.user?.name || "Nije postavljeno"}</p>
      </div>

      {/* Current Setup Image */}
      {userSetup && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Tvoj PC setup</h2>
          <img
            src={userSetup}
            alt="Tvoj setup"
            className="w-full max-h-96 object-contain rounded-lg"
          />
        </div>
      )}

      {/* Setup Image Upload */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Učitaj sliku svoga PC setupa
        </h2>

        {preview && (
          <div className="mb-6">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-96 object-contain rounded-lg"
            />
          </div>
        )}

        <div className="space-y-4">
          <label className="block">
            <div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
              <div className="text-center">
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-gray-200">Klikni ili povuci sliku</p>
                <p className="text-sm text-gray-400">
                  JPG, PNG (Max 5MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
              />
            </div>
          </label>

          {setupImage && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {isUploading ? "Učitavanje..." : "Učitaj sliku"}
            </button>
          )}

          {message && (
            <p
              className={`text-center text-sm ${
                message.includes("uspješno")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
