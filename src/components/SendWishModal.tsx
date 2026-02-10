"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEscapeKey } from "@/hooks/useEscapeKey";
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
  ImageIcon,
  Trash2,
} from "lucide-react";
import Button from "@/components/Button";

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
  imageUrl: string | null;
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

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 1200;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        },
        "image/jpeg",
        0.8,
      );
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = URL.createObjectURL(file);
  });
}

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

  const handleEscape = useCallback(() => onClose(), [onClose]);
  useEscapeKey(handleEscape, isOpen);

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);

    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image file");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be under 2MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleSubmit = async () => {
    if (!comment.trim() && !name.trim()) return;

    setPhase("submitting");
    try {
      // Upload image first if present
      let imageUrl: string | null = null;
      if (imageFile) {
        setUploadingImage(true);
        const compressed = await compressImage(imageFile);
        const fd = new FormData();
        fd.append("file", compressed, "wish-image.jpg");
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
        setUploadingImage(false);
      }

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
          imageUrl,
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
        imageUrl: data.submission.imageUrl || null,
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
    handleRemoveImage();
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
          className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
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
              <Button variant="icon" size="sm" onClick={handleClose}>
                <X size={18} />
              </Button>
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
                    className="p-5 space-y-4 text-left"
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

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Add Photo <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      {imagePreview ? (
                        <div className="relative inline-block">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={120}
                            height={120}
                            className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                            unoptimized
                          />
                          <button
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center gap-2 w-full p-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition cursor-pointer">
                          {uploadingImage ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <ImageIcon size={16} />
                          )}
                          Choose image (max 2MB)
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                        </label>
                      )}
                      {imageError && (
                        <p className="text-xs text-red-500 mt-1">{imageError}</p>
                      )}
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
                                    type="text"
                                    inputMode="numeric"
                                    value={
                                      amount
                                        ? parseInt(amount, 10).toLocaleString(
                                            "id-ID",
                                          )
                                        : ""
                                    }
                                    onChange={(e) => {
                                      const raw = e.target.value.replace(
                                        /\D/g,
                                        "",
                                      );
                                      setAmount(raw);
                                    }}
                                    placeholder="50,000"
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
                      className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-40 bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-600/20"
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
                    <Loader2 size={32} className="animate-spin text-red-500" />
                    <p className="text-sm text-gray-500">
                      {uploadingImage ? "Uploading image..." : "Sending your wish..."}
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
                          <Image
                            src={selectedMethodData.detail}
                            alt={selectedMethodData.label}
                            width={208}
                            height={208}
                            className="w-52 h-52 object-contain mx-auto"
                            unoptimized
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
                          <Button
                            variant="icon"
                            size="md"
                            onClick={handleCopyNumber}
                          >
                            {copied ? (
                              <Check size={18} className="text-green-500" />
                            ) : (
                              <Copy size={18} />
                            )}
                          </Button>
                        </div>
                      )}

                      {amount && (
                        <p className="text-lg font-bold text-red-600">
                          Rp {parseInt(amount, 10).toLocaleString("id-ID")}
                        </p>
                      )}

                      {paymentMethods?.instructionsText && (
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {paymentMethods.instructionsText}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="secondary"
                      size="lg"
                      fullWidth
                      onClick={handleClose}
                    >
                      Done
                    </Button>
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
