"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between">
        <Link href="/" className="font-bold text-xl">
          Blog Platform
        </Link>
        <div>
          {token ? (
            <>
              <Link
                href="/create-post"
                className={`mr-4 ${pathname === "/create-post" ? "text-blue-600 font-semibold" : ""}`}
              >
                Create Post
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`mr-4 ${pathname === "/login" ? "text-blue-600 font-semibold" : ""}`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={pathname === "/register" ? "text-blue-600 font-semibold" : ""}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      <main className="max-w-4xl mx-auto p-6">{children}</main>
    </div>
  );
}
