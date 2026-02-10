"use client";

import { Suspense, useRef } from "react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Button from "@/components/Button";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";
import { TextField, PasswordField } from "@/components/TextField";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logoIcon, logoTextDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toastShownRef = useRef(false);

  // Show contextual toasts based on redirect reason
  useEffect(() => {
    if (toastShownRef.current) return;
    if (searchParams.get("registered") === "true") {
      toastShownRef.current = true;
      toast.success("Account created! Please sign in.");
    } else if (searchParams.get("reason") === "session_expired") {
      toastShownRef.current = true;
      toast.error("Your session has expired. Please sign in again.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid email or password");
      setIsLoading(false);
    } else {
      toast.success("Welcome back!");
      router.push("/app");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-black overflow-hidden font-sans">
      {/* Left Side - Visual */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden"
      >
        {/* Background Image / Abstract */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1548679720-3df74ba0c4df?q=80&w=2070&auto=format&fit=crop)",
          }} // Example CNY/Red abstract
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40" />

        <div className="relative z-10 p-12 text-center text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Image
                src={logoIcon}
                alt="Bizapps.id"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
                priority
              />
              <Image
                src={logoTextDark}
                alt="Bizapps.id"
                width={160}
                height={32}
                className="h-8 object-contain"
              />
            </div>
            <p className="text-lg text-gray-300 font-light leading-relaxed">
              Connect with prosperity. Share your wishes instantly with elegant,
              animated digital greetings.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} /> Back to Home
        </Link>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Sign in to manage your greetings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              type="email"
              label="Email Address"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <PasswordField
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="mt-2 text-right">
                <a href="#" className="text-sm link-theme font-medium">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                iconRight={!isLoading ? <ArrowRight size={18} /> : undefined}
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-theme-primary font-bold hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
