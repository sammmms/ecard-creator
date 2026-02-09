"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";
import { TextField, PasswordField } from "@/components/TextField";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { logoIcon, logoTextDark } = useTheme();
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      router.push("/login?registered=true");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-black overflow-hidden font-sans">
      {/* Right Side - Visual (Swapped for variety or keep same side? Let's swap for variety) */}
      {/* Actually let's keep consistent left side visual for branding consistency, maybe different image */}

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          // Different abstract image
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1516013289047-9ce41180fb78?q=80&w=2064&auto=format&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-red-900/40 via-transparent to-black/60" />

        <div className="relative z-10 p-12 text-center text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <img
                src={logoIcon}
                alt="Bizapps.id"
                className="w-12 h-12 object-contain"
              />
              <img
                src={logoTextDark}
                alt="Bizapps.id"
                className="h-8 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold mb-6 font-outfit">
              Join the Prosperity
            </h1>
            <p className="text-xl text-gray-200 font-light">
              Create unlimited greeting campaigns and spread joy to your entire
              network.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left mt-12 lg:mt-0">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">
              Create Account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Start your greeting campaign today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              type="text"
              label="Company Name"
              placeholder="Your Company Name"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              required
            />

            <TextField
              type="email"
              label="Email Address"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PasswordField
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <PasswordField
                label="Confirm Password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 btn-theme text-white py-3.5 rounded-xl font-bold transition-all transform active:scale-[0.98] shadow-theme"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight size={18} />
                  </>
                )}
              </button>
              <p className="mt-4 text-center text-sm text-gray-500">
                By registering, you agree to our{" "}
                <a href="#" className="underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-theme-primary font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
