"use client";

import { useState } from "react";

import {
  Leaf,
  User,
  Store,
  ArrowRight,
  Loader2,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {

  const {
    login,
    signup,
    isLoading,
    role,
  } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && role) {
      router.replace(role === "shop_owner" ? "/shop" : "/");
    }
  }, [isLoading, role, router]);

  const [isLogin, setIsLogin] =
    useState(true);

  const [roleSel, setRoleSel] = useState<
    "customer" | "shop"
  >("customer");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [name, setName] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [errors, setErrors] =
    useState<{
      email?: string;
      password?: string;
      name?: string;
    }>({});

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {

    const newErrors: typeof errors =
      {};

    if (
      !isLogin &&
      !name.trim()
    ) {
      newErrors.name =
        "Name is required";
    }

    if (
      !email.includes("@")
    ) {
      newErrors.email =
        "Enter valid email";
    }

    if (
      password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  // =========================
  // HANDLE SUBMIT
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setErrors({});
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    try {

      const selectedRole =
        roleSel === "shop"
          ? "shop_owner"
          : "customer";

      // =====================
      // LOGIN
      // =====================

      if (isLogin) {

        await login(
          email,
          password
        );

        // role is populated by onAuthStateChanged after login completes.
        // We read from the AuthContext `role` (not form state) for redirect.
        // onAuthStateChanged sets role async, so use a small delay or
        // let the middleware/layout redirect based on cookie + role.
        // For now redirect to home — the shop layout will guard access.
        window.location.href = "/";

        return;
      }

      // =====================
      // SIGNUP
      // =====================

      await signup(
        email,
        password,
        name,
        selectedRole
      );

      // switch to login page
      setIsLogin(true);

      // clear fields
      setPassword("");
      setName("");

      // show success in green, not as an error
      setSuccessMessage(
        "Account created! Please sign in now."
      );

      return;

    } catch (error: unknown) {

      console.error(
        "Auth error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Authentication failed";

      setErrors({
        email: message,
      });
    }
  };

  return (

    <div className="min-h-screen bg-gray-950 flex justify-center items-center px-4 relative overflow-hidden">

      {/* Background */}

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

      {/* Card */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.4,
        }}

        className="w-full max-w-md relative z-10"
      >

        {/* Logo */}

        <Link
          href="/"
          className="flex items-center justify-center gap-3 mb-8"
        >

          <div className="bg-emerald-500 p-3 rounded-2xl">

            <Leaf className="text-white" />

          </div>

          <h1 className="text-4xl font-bold text-white">

            FreshSave

          </h1>

        </Link>

        {/* Main Box */}

        <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-8 shadow-2xl">

          {/* Tabs */}

          <div className="flex bg-gray-950 rounded-2xl p-1 mb-8">

            <button
              onClick={() => {
                setIsLogin(true);
                setErrors({});
              }}

              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                isLogin
                  ? "bg-gray-800 text-white"
                  : "text-gray-500"
              }`}
            >

              Log In

            </button>

            <button
              onClick={() => {
                setIsLogin(false);
                setErrors({});
              }}

              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                !isLogin
                  ? "bg-gray-800 text-white"
                  : "text-gray-500"
              }`}
            >

              Sign Up

            </button>

          </div>

          {/* Heading */}

          <div className="mb-6">

            <h2 className="text-3xl font-bold text-white">

              {isLogin
                ? "Welcome back"
                : "Create account"}

            </h2>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ROLE */}

            {!isLogin && (

              <div className="grid grid-cols-2 gap-4">

                <button
                  type="button"

                  onClick={() =>
                    setRoleSel(
                      "customer"
                    )
                  }

                  className={`p-4 rounded-2xl border ${
                    roleSel ===
                    "customer"
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-gray-700"
                  }`}
                >

                  <User className="mx-auto mb-2 text-white" />

                  <p className="text-white">

                    Customer

                  </p>

                </button>

                <button
                  type="button"

                  onClick={() =>
                    setRoleSel("shop")
                  }

                  className={`p-4 rounded-2xl border ${
                    roleSel === "shop"
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-gray-700"
                  }`}
                >

                  <Store className="mx-auto mb-2 text-white" />

                  <p className="text-white">

                    Shop Owner

                  </p>

                </button>

              </div>
            )}

            {/* NAME */}

            {!isLogin && (

              <div>

                <input
                  type="text"

                  value={name}

                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }

                  placeholder={
                    role === "shop"
                      ? "Shop Name"
                      : "Full Name"
                  }

                  className="w-full bg-gray-950 border border-gray-700 text-white rounded-2xl px-4 py-4 outline-none"
                />

                {errors.name && (

                  <p className="text-red-500 text-sm mt-1">

                    {errors.name}

                  </p>
                )}

              </div>
            )}

            {/* EMAIL */}

            <div>

              <input
                type="email"

                value={email}

                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }

                placeholder="you@example.com"

                className="w-full bg-gray-950 border border-gray-700 text-white rounded-2xl px-4 py-4 outline-none"
              />

              {errors.email && (

                <p className="text-red-500 text-sm mt-1">

                  {errors.email}

                </p>
              )}

              {successMessage && (

                <p className="text-emerald-400 text-sm mt-1">

                  {successMessage}

                </p>
              )}

            </div>

            {/* PASSWORD */}

            <div>

              <input
                type="password"

                value={password}

                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }

                placeholder="Password"

                className="w-full bg-gray-950 border border-gray-700 text-white rounded-2xl px-4 py-4 outline-none"
              />

              {errors.password && (

                <p className="text-red-500 text-sm mt-1">

                  {errors.password}

                </p>
              )}

            </div>

            {/* BUTTON */}

            <button
              type="submit"

              disabled={isLoading}

              className="w-full bg-white text-black py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >

              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {isLogin
                    ? "Sign In"
                    : "Create Account"}

                  <ArrowRight size={18} />
                </>
              )}

            </button>

          </form>

        </div>

      </motion.div>

    </div>
  );
}