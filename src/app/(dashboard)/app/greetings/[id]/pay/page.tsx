"use client";

import { useState, Suspense } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as anim from "@/lib/animations";
import Shimmer from "@/components/Shimmer";
import toast from "react-hot-toast";
import { GreetingStatus, PaymentStatus, PaymentType } from "@/lib/constants";

interface Payment {
  id: string;
  amount: number;
  status: string;
  type: string;
}

interface Greeting {
  id: string;
  title: string;
  isTrial: boolean;
  template: {
    name: string;
    price: number;
    premiumPrice?: number | null;
    extensionMonths: number;
    extensionPrice: number;
  };
  payments: Payment[];
  status: string;
}

export default function PayPage() {
  return (
    <Suspense fallback={<PayPageSkeleton />}>
      <PayPageContent />
    </Suspense>
  );
}

function PayPageSkeleton() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-2">
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-8 w-52" />
        <Shimmer className="h-4 w-64" />
      </div>
      <div className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex justify-between items-center">
          <Shimmer className="h-4 w-20" />
          <Shimmer className="h-4 w-32" />
        </div>
        <div className="flex justify-between items-center">
          <Shimmer className="h-4 w-12" />
          <Shimmer className="h-6 w-28" />
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Shimmer className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function PayPageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const isUpgrade = searchParams.get("upgrade") === "true";
  const isExtend = searchParams.get("extend") === "true";
  const { data: greeting, isLoading: loading, mutate } = useSWR<Greeting>(
    `/api/greetings/${params.id}`,
    fetcher,
  );
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    try {
      const payUrl = isExtend
        ? `/api/greetings/${params.id}/pay?extend=true`
        : `/api/greetings/${params.id}/pay`;

      // TODO: When integrating Xendit, the API will return a checkoutUrl
      // and we should redirect the user: window.location.href = data.checkoutUrl
      const res = await fetch(payUrl, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Payment failed. Please try again.");
        setProcessing(false);
        return;
      }

      if (data.success) {
        if (isExtend) {
          toast.success(`Extended by ${data.extensionMonths} months!`);
        } else if (isUpgrade) {
          toast.success("Upgrade successful!");
        } else {
          toast.success("Payment successful!");
        }
        mutate();
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) return <PayPageSkeleton />;
  if (!greeting) return <div>Greeting not found</div>;

  const purchasePayment = greeting.payments.find(
    (p) =>
      (p.type === PaymentType.PURCHASE || p.type === PaymentType.UPGRADE) &&
      p.status === PaymentStatus.PAID,
  );

  // Determine if this payment mode is already done
  let isPaid = false;
  if (isExtend) {
    // Extension just completed — check if the mutate refreshed data
    // We rely on the success toast + redirect instead
    isPaid = false;
  } else if (isUpgrade) {
    isPaid = greeting.status === GreetingStatus.PUBLISHED && !greeting.isTrial;
  } else {
    isPaid = greeting.status === GreetingStatus.PUBLISHED && !!purchasePayment;
  }

  // Price depends on mode
  let price: number;
  let heading: string;
  let subtitle: string;
  let successMessage: string;
  let successDetail: string;
  let buttonLabel: string;
  let backHref: string;
  let backLabel: string;
  let returnLabel: string;

  if (isExtend) {
    price = greeting.template.extensionPrice;
    heading = "Extend Greeting";
    subtitle = `Pay to extend your greeting by ${greeting.template.extensionMonths} months.`;
    successMessage = "Extension Successful!";
    successDetail = `Your greeting has been extended by ${greeting.template.extensionMonths} months.`;
    buttonLabel = `Extend ${greeting.template.extensionMonths} Months`;
    backHref = `/app/greetings/${params.id}/edit`;
    backLabel = "Back to editor";
    returnLabel = "Back to Editor";
  } else if (isUpgrade) {
    price = greeting.template.premiumPrice ?? greeting.template.price;
    heading = "Upgrade Greeting";
    subtitle = "Pay to upgrade your trial greeting to full access.";
    successMessage = "Upgrade Successful!";
    successDetail = "Your greeting is now fully unlocked.";
    buttonLabel = "Upgrade Now";
    backHref = `/app/greetings/${params.id}/edit`;
    backLabel = "Back to editor";
    returnLabel = "Back to Editor";
  } else {
    price = greeting.template.price;
    heading = "Complete Payment";
    subtitle = "Pay to publish your greeting card.";
    successMessage = "Payment Successful!";
    successDetail = "Your greeting is now live and shareable.";
    buttonLabel = "Pay Now";
    backHref = "/app/greetings";
    backLabel = "Back to greetings";
    returnLabel = "Return to Greetings";
  }

  return (
    <motion.div
      className="max-w-xl mx-auto space-y-6"
      initial="hidden"
      animate="visible"
      variants={anim.staggerContainer}
    >
      <motion.div variants={anim.fadeInDown}>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={14} /> {backLabel}
        </Link>
        <h1 className="text-3xl font-bold">{heading}</h1>
        <p className="text-gray-500 mt-1">{subtitle}</p>
      </motion.div>

      <motion.div
        variants={anim.scaleIn}
        className="glass-card p-6 rounded-xl space-y-4"
      >
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Template</span>
          <span className="font-medium">{greeting.template.name}</span>
        </div>
        {isExtend && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Duration</span>
            <span className="font-medium">{greeting.template.extensionMonths} months</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Price</span>
          <span className="font-bold text-lg">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(price)}
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
                <span className="text-xl font-bold">{successMessage}</span>
                <p className="text-sm text-gray-500">{successDetail}</p>
                <motion.button
                  onClick={() => router.push(backHref)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-full mt-2 font-medium"
                >
                  {returnLabel}
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
                      <CreditCard size={18} /> {buttonLabel}
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-xs text-center text-gray-400 mt-4">
          {/* TODO: Remove this notice when real payment is integrated */}
          * This is a mock payment for MVP. Clicking &quot;{buttonLabel}&quot; will
          automatically mark it as paid.
        </p>
      </motion.div>
    </motion.div>
  );
}
