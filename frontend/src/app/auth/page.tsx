"use client";

import { useState } from "react";
import { Leaf, Mail, Lock, User, Store, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"customer" | "shop">("customer");
  const { login } = useAuth();
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!isLogin && !name.trim()) newErrors.name = "Name is required";
    if (!email.includes("@")) newErrors.email = "Valid email is required";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Mock Authentication logic based strictly on the selected role button
      login(role);
      router.push(role === "shop" ? "/shop" : "/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/30">
            <Leaf size={28} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">FreshSave</h1>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white dark:bg-gray-800 py-8 px-6 sm:px-10 shadow-xl border border-gray-100 dark:border-gray-700 rounded-3xl">
          
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl mb-8">
            <button
              onClick={() => { setIsLogin(true); setErrors({}); }}
              className={`flex-1 text-sm font-semibold py-2.5 rounded-xl transition-all ${
                isLogin 
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" 
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrors({}); }}
              className={`flex-1 text-sm font-semibold py-2.5 rounded-xl transition-all ${
                !isLogin 
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" 
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isLogin ? "Enter your details to access your account." : "Join to save food and money today."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5 overflow-hidden"
                >
                  {/* Role Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">I am a...</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole("customer")}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                          role === "customer"
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800 text-gray-500"
                        }`}
                      >
                        <User size={24} className="mb-2" />
                        <span className="text-sm font-semibold">Customer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("shop")}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                          role === "shop"
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800 text-gray-500"
                        }`}
                      >
                        <Store size={24} className="mb-2" />
                        <span className="text-sm font-semibold">Shop Owner</span>
                      </button>
                    </div>
                  </div>

                  {/* Name Input */}
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {role === "shop" ? "Shop Name" : "Full Name"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {role === "shop" ? <Store size={18} className="text-gray-400" /> : <User size={18} className="text-gray-400" />}
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full bg-gray-50 dark:bg-gray-900 border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition`}
                          placeholder={role === "shop" ? "Green Valley Market" : "John Doe"}
                        />
                      </div>
                      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>
                  )}
                </motion.div>
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-gray-50 dark:bg-gray-900 border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-gray-50 dark:bg-gray-900 border ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-500 transition">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 py-3.5 px-4 rounded-xl font-bold shadow-lg transition-transform active:scale-[0.98]"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight size={18} />
            </button>
          </form>


        </div>
        
        {/* Footer links */}
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          By continuing, you agree to FreshSave&apos;s <br />
          <a href="#" className="font-semibold hover:text-emerald-500 transition">Terms of Service</a> and{" "}
          <a href="#" className="font-semibold hover:text-emerald-500 transition">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );
}
