"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as anim from "@/lib/animations";
import PageLoader from "@/components/PageLoader";
import toast from "react-hot-toast";

interface Payment {
  id: string;
  amount: number;
  status: string;
  checkoutUrl: string;
}

interface Greeting {
  id: string;
  title: string;
  template: { name: string; price: number };
  payment?: Payment;
  status: string;
}

export default function PayPage() {
  const router = useRouter();
  const params = useParams();
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch(`/api/greetings/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setGreeting(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load greeting");
        setLoading(false);
      });
  }, [params.id]);

  const handlePay = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/greetings/${params.id}/pay`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.checkoutUrl) {
        await fetch(`/api/payments/webhook?paymentId=${data.payment.id}`);
        toast.success("Payment successful!");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!greeting) return <div>Greeting not found</div>;

  const isPaid =
    greeting.status === "published" || greeting.payment?.status === "paid";

  return (
    <motion.div
      className="max-w-xl mx-auto space-y-6"
      initial="hidden"
      animate="visible"
      variants={anim.staggerContainer}
    >
      <motion.div variants={anim.fadeInDown}>
        <Link
          href="/app/greetings"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={14} /> Back to greetings
        </Link>
        <h1 className="text-3xl font-bold">Complete Payment</h1>
        <p className="text-gray-500 mt-1">Pay to publish your greeting card.</p>
      </motion.div>

      <motion.div
        variants={anim.scaleIn}
        className="glass-card p-6 rounded-xl space-y-4"
      >
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Template</span>
          <span className="font-medium">{greeting.template.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Price</span>
          <span className="font-bold text-lg">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(greeting.template.price)}
          </span>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <AnimatePresence mode="wait">
            {isPaid ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="flex flex-col items-center gap-4 text-green-600 py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 15,
                    delay: 0.1,
                  }}
                >
                  <CheckCircle size={56} />
                </motion.div>
                <span className="text-xl font-bold">Payment Successful!</span>
                <p className="text-sm text-gray-500">
                  Your greeting is now live and shareable.
                </p>
                <motion.button
                  onClick={() => router.push("/app/greetings")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-full mt-2 font-medium"
                >
                  Return to Greetings
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="pay" exit={{ opacity: 0 }}>
                <motion.button
                  onClick={handlePay}
                  disabled={processing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-theme text-white py-3.5 rounded-xl font-bold transition-colors flex justify-center items-center gap-2"
                >
                  {processing ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <CreditCard size={18} /> Pay Now
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-xs text-center text-gray-400 mt-4">
          * This is a mock payment for MVP. Clicking &quot;Pay Now&quot; will
          automatically mark it as paid.
        </p>
      </motion.div>
    </motion.div>
  );
}
