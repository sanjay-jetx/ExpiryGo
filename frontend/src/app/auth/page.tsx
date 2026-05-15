"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf, User, Store, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth, Role } from "@/contexts/AuthContext";

export default function AuthenticationPage() {
  const router = useRouter();
  const { isLoading, role, login, signup } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [roleSel, setRoleSel] = useState<"customer" | "shop_owner">("customer");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && role) {
      router.replace(role === "shop_owner" ? "/shop" : "/");
    }
  }, [isLoading, role, router]);

  const validateForm = () => {
    if (!email || !email.includes("@")) return "Please enter a valid email address.";
    if (!password || password.length < 6) return "Password must be at least 6 characters long.";
    if (mode === "signup" && !name.trim()) return "Full name is required.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
        // On success, AuthContext state updates and the useEffect above redirects.
      } else {
        await signup(email, password, name, roleSel);
        // On success, redirect new shop owners to setup, customers to home
        if (roleSel === "shop_owner") {
          router.push("/shop/setup");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      const message = err?.message || "Authentication failed.";
      
      // Map common errors to user-friendly messages
      if (message.includes("already registered")) {
        setError("This email is already registered. Please login instead.");
        setMode("login");
      } else if (message.includes("Invalid email or password")) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError("Something went wrong on our end. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8 hover:scale-105 transition-transform">
        <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/30">
          <Leaf size={24} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">FreshSave</h1>
      </Link>

      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl">
        {/* Toggle Login/Signup */}
        <div className="flex bg-gray-100 dark:bg-gray-950 rounded-xl p-1 mb-8 shadow-inner">
          <button
            type="button"
            onClick={() => { setMode("login"); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${
              mode === "login" 
                ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${
              mode === "signup" 
                ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {mode === "login" ? "Welcome Back!" : "Join FreshSave"}
        </h2>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Signup Extra Fields */}
          {mode === "signup" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setRoleSel("customer")}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                    roleSel === "customer" 
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                      : "border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  <User size={24} />
                  <span className="text-xs font-bold">Shopper</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoleSel("shop_owner")}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                    roleSel === "shop_owner" 
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                      : "border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  <Store size={24} />
                  <span className="text-xs font-bold">Shop Owner</span>
                </button>
              </div>

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}