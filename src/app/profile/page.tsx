"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface UserProfile {
  email: string;
  name?: string;
  setupImage?: string;
}

interface UserSetup {
  id: string;
  title: string;
  image: string;
  commentCount: number;
  rating: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userSetups, setUserSetups] = useState<UserSetup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserSetups();
      // Check if email is verified
      checkEmailVerification();
    }
  }, [status]);

  const checkEmailVerification = async () => {
    try {
      const response = await fetch("/api/auth/profile");
      if (response.ok) {
        const data = await response.json();
        setEmailVerified(data.emailVerified);
      }
    } catch (error) {
      console.error("Error checking email verification:", error);
    }
  };

  const requestEmailVerification = async () => {
    setVerifyingEmail(true);
    try {
      const response = await fetch("/api/auth/request-email-verification", {
        method: "POST",
      });

      if (response.ok) {
        alert("Verifikacijski kod je poslan na tvoj email!");
      } else {
        const data = await response.json();
        alert(`Greška: ${data.error}`);
      }
    } catch (error) {
      console.error("Error requesting email verification:", error);
      alert("Greška pri slanju verifikacijskog koda");
    } finally {
      setVerifyingEmail(false);
    }
  };

  const fetchUserSetups = async () => {
    try {
      const response = await fetch("/api/setups");
      if (response.ok) {
        const data = await response.json();
        // Filter only user's setups
        const filtered = data.filter(
          (setup: any) => setup.author === session?.user?.name
        );
        setUserSetups(filtered);
      }
    } catch (error) {
      console.error("Error fetching user setups:", error);
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-8 text-white border border-slate-700">
        <h1 className="text-4xl font-bold mb-4">Moj profil</h1>
        <p className="text-gray-200">Email: {session?.user?.email}</p>
        <p className="text-gray-300">Ime: {session?.user?.name || "Nije postavljeno"}</p>
        
        {/* Email Verification Section */}
        <div className="mt-6 pt-6 border-t border-slate-600">
          {emailVerified ? (
            <div className="flex items-center gap-2 text-green-400">
              <span>✓</span>
              <span>Email je verificiran</span>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-yellow-400 flex items-center gap-2">
                <span>⚠</span>
                <span>Email nije verificiran</span>
              </p>
              <button
                onClick={requestEmailVerification}
                disabled={verifyingEmail}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                {verifyingEmail ? "Slanje..." : "Verificiraj email"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* My Setups Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Moji Setups</h2>
          <Link
            href="/setups"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            + Novi Setup
          </Link>
        </div>

        {userSetups.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
            <p className="text-gray-300 mb-4">Nemaš objavljenih setupa</p>
            <Link
              href="/setups"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg inline-block"
            >
              Objavi prvi setup
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userSetups.map((setup) => (
              <Link
                key={setup.id}
                href={`/setups/${setup.id}`}
                className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500 transition"
              >
                <img
                  src={setup.image}
                  alt={setup.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-3">
                  <h3 className="text-lg font-bold text-white">{setup.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 border-t border-slate-700 pt-3">
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>{setup.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>💬</span>
                      <span>{setup.commentCount}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
