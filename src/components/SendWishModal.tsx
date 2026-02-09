"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  Send,
  Loader2,
  CheckCircle,
  Wallet,
  QrCode,
  Copy,
  Check,
} from "lucide-react";

interface PaymentMethods {
  qrisImages: Array<{ label: string; url: string }>;
  ewalletType: string | null;
  ewalletNumber: string | null;
  instructionsText: string | null;
  displayName: string | null;
}

interface WishData {
  id: string;
  name: string | null;
  comment: string | null;
  createdAt: string;
  donationAmount: number | null;
}

interface SendWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  greetingId: string;
  donationEnabled: boolean;
  donationMode: string;
  paymentMethods: PaymentMethods | null;
  onWishSent: (wish: WishData) => void;
}

type ModalPhase = "form" | "submitting" | "success" | "payment-info";

export default function SendWishModal({
  isOpen,
  onClose,
  greetingId,
  donationEnabled,
  donationMode,
  paymentMethods,
  onWishSent,
}: SendWishModalProps) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [includeDonation, setIncludeDonation] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [phase, setPhase] = useState<ModalPhase>("form");
  const [copied, setCopied] = useState(false);

  // Build available payment methods
  const methods: Array<{
    id: string;
    type: "qris" | "ewallet";
    label: string;
    detail: string;
  }> = [];

  if (paymentMethods?.qrisImages) {
    paymentMethods.qrisImages.forEach((qr, i) => {
      methods.push({
        id: `qris-${i}`,
        type: "qris",
        label: qr.label,
        detail: qr.url,
      });
    });
  }

  if (paymentMethods?.ewalletType && paymentMethods?.ewalletNumber) {
    methods.push({
      id: "ewallet",
      type: "ewallet",
      label: paymentMethods.ewalletType,
      detail: paymentMethods.ewalletNumber,
    });
  }

  const selectedMethodData = methods.find((m) => m.id === selectedMethod);

  const handleSubmit = async () => {
    if (!comment.trim() && !name.trim()) return;

    setPhase("submitting");
    try {
      const res = await fetch("/api/public/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          greetingId,
          name: name.trim() || null,
          comment: comment.trim() || null,
          donationAmount:
            includeDonation && amount ? parseInt(amount, 10) : null,
          paymentMethod: includeDonation ? selectedMethod : null,
        }),
      });

      if (!res.ok) {
        setPhase("form");
        return;
      }

      const data = await res.json();

      onWishSent({
        id: data.submission.id,
        name: data.submission.name,
        comment: data.submission.comment,
        createdAt: data.submission.createdAt,
        donationAmount: data.donationPayment?.amount || null,
      });

      // If manual donation with a selected method, show payment info
      if (
        includeDonation &&
        donationMode === "manual" &&
        selectedMethodData &&
        amount
      ) {
        setPhase("payment-info");
      } else {
        setPhase("success");
        setTimeout(() => handleClose(), 2000);
      }
    } catch {
      setPhase("form");
    }
  };

  const handleClose = () => {
    setPhase("form");
    setName("");
    setComment("");
    setIncludeDonation(false);
    setAmount("");
    setSelectedMethod("");
    setCopied(false);
    onClose();
  };

  const handleCopyNumber = () => {
    if (paymentMethods?.ewalletNumber) {
      navigator.clipboard.writeText(paymentMethods.ewalletNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canSubmit =
    (comment.trim() || name.trim()) &&
    (!includeDonation || (amount && parseInt(amount, 10) > 0));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-red-500" />
                <h3 className="font-bold text-gray-900">Send Wish</h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
              <AnimatePresence mode="wait">
                {/* Form Phase */}
                {phase === "form" && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5 space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Your Name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Anonymous"
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Your Wishes
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your wishes and blessings..."
                        rows={3}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition resize-none"
                      />
                    </div>

                    {/* Donation checkbox */}
                    {donationEnabled && methods.length > 0 && (
                      <>
                        <label className="flex items-center gap-3 cursor-pointer group py-1">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={includeDonation}
                              onChange={(e) =>
                                setIncludeDonation(e.target.checked)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-red-500 peer-checked:border-red-500 transition flex items-center justify-center">
                              {includeDonation && (
                                <Check
                                  size={14}
                                  className="text-white"
                                  strokeWidth={3}
                                />
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                            <Heart size={14} className="text-red-400" />
                            Include a donation
                          </span>
                        </label>

                        {/* Donation fields */}
                        <AnimatePresence>
                          {includeDonation && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden space-y-4"
                            >
                              {/* Amount */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Amount
                                </label>
                                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition">
                                  <span className="px-3 py-2.5 bg-gray-50 text-sm font-medium text-gray-500 border-r border-gray-200">
                                    Rp
                                  </span>
                                  <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="50,000"
                                    min="1000"
                                    className="flex-1 p-2.5 text-sm outline-none"
                                  />
                                </div>
                              </div>

                              {/* Payment methods */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Payment Method
                                </label>
                                <div className="space-y-2">
                                  {methods.map((method) => (
                                    <label
                                      key={method.id}
                                      className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${
                                        selectedMethod === method.id
                                          ? "border-red-400 bg-red-50 ring-1 ring-red-200"
                                          : "border-gray-200 hover:border-gray-300"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name="payment-method"
                                        value={method.id}
                                        checked={selectedMethod === method.id}
                                        onChange={() =>
                                          setSelectedMethod(method.id)
                                        }
                                        className="sr-only"
                                      />
                                      <div
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                          selectedMethod === method.id
                                            ? "bg-red-100 text-red-600"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                      >
                                        {method.type === "qris" ? (
                                          <QrCode size={18} />
                                        ) : (
                                          <Wallet size={18} />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800">
                                          {method.label}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">
                                          {method.type === "qris"
                                            ? "Scan QR code"
                                            : `${method.detail.slice(0, 4)}****${method.detail.slice(-4)}`}
                                        </p>
                                      </div>
                                      <div
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                          selectedMethod === method.id
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        }`}
                                      >
                                        {selectedMethod === method.id && (
                                          <div className="w-2 h-2 rounded-full bg-red-500" />
                                        )}
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}

                    {/* Submit button */}
                    <motion.button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      whileHover={canSubmit ? { scale: 1.01 } : {}}
                      whileTap={canSubmit ? { scale: 0.98 } : {}}
                      className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-40 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-600/20"
                    >
                      <Send size={16} />
                      {includeDonation && amount
                        ? "Send Wish & Donate"
                        : "Send Wish"}
                    </motion.button>
                  </motion.div>
                )}

                {/* Submitting Phase */}
                {phase === "submitting" && (
                  <motion.div
                    key="submitting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-10 flex flex-col items-center gap-3"
                  >
                    <Loader2
                      size={32}
                      className="animate-spin text-red-500"
                    />
                    <p className="text-sm text-gray-500">
                      Sending your wish...
                    </p>
                  </motion.div>
                )}

                {/* Success Phase */}
                {phase === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-10 flex flex-col items-center gap-3"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 15,
                      }}
                    >
                      <CheckCircle size={48} className="text-green-500" />
                    </motion.div>
                    <p className="text-lg font-bold text-gray-800">
                      Wish Sent!
                    </p>
                    <p className="text-sm text-gray-500 text-center">
                      Your wishes and blessings have been shared.
                    </p>
                  </motion.div>
                )}

                {/* Payment Info Phase (manual mode) */}
                {phase === "payment-info" && selectedMethodData && (
                  <motion.div
                    key="payment-info"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5 space-y-4"
                  >
                    <div className="text-center">
                      <CheckCircle
                        size={32}
                        className="text-green-500 mx-auto mb-2"
                      />
                      <p className="font-bold text-gray-800">Wish Sent!</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Complete your donation below
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 text-center space-y-3">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        {selectedMethodData.type === "qris"
                          ? "Scan QR Code"
                          : "Transfer via E-Wallet"}
                      </p>

                      {selectedMethodData.type === "qris" && (
                        <div className="bg-white p-3 rounded-lg border border-gray-200 inline-block">
                          <img
                            src={selectedMethodData.detail}
                            alt={selectedMethodData.label}
                            className="w-52 h-52 object-contain mx-auto"
                          />
                        </div>
                      )}

                      <p className="text-sm font-semibold text-gray-700">
                        {selectedMethodData.label}
                      </p>

                      {selectedMethodData.type === "ewallet" && (
                        <div className="flex items-center justify-center gap-2">
                          <code className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-lg font-mono font-bold text-gray-800">
                            {selectedMethodData.detail}
                          </code>
                          <button
                            onClick={handleCopyNumber}
                            className="p-2 rounded-lg hover:bg-gray-200 transition text-gray-500"
                          >
                            {copied ? (
                              <Check size={18} className="text-green-500" />
                            ) : (
                              <Copy size={18} />
                            )}
                          </button>
                        </div>
                      )}

                      {amount && (
                        <p className="text-lg font-bold text-red-600">
                          Rp{" "}
                          {parseInt(amount, 10).toLocaleString("id-ID")}
                        </p>
                      )}

                      {paymentMethods?.instructionsText && (
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {paymentMethods.instructionsText}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleClose}
                      className="w-full py-3 rounded-xl border border-gray-200 font-medium text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
