"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Nedostaje verifikacijski token");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error);
        }
      } catch (error) {
        setStatus("error");
        setMessage("Došlo je do greške");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            Verifikacija emaila
          </h1>

          {status === "loading" && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-slate-400">Verifikujem email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-green-400 mb-4">{message}</p>
              <p className="text-slate-400 text-sm">
                Preusmeravamo te na stranicu za prijavu...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-red-400 mb-4">{message}</p>
              <Link
                href="/auth/login"
                className="inline-block mt-4 text-blue-400 hover:text-blue-300"
              >
                Nazad na prijavu
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="text-white">Učitavanje...</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
