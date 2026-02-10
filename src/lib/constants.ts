// ============================================================
// Status enums — single source of truth for all status values.
// When adding a new status, update the relevant enum here.
// ============================================================

/** Greeting lifecycle: draft → pending_payment → published */
export const GreetingStatus = {
  DRAFT: "draft",
  PENDING_PAYMENT: "pending_payment",
  PUBLISHED: "published",
} as const;
export type GreetingStatus =
  (typeof GreetingStatus)[keyof typeof GreetingStatus];

/** Payment lifecycle: pending → paid | failed | expired */
export const PaymentStatus = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  EXPIRED: "expired",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

/** Payment type: purchase, upgrade, or extension */
export const PaymentType = {
  PURCHASE: "purchase",
  UPGRADE: "upgrade",
  EXTENSION: "extension",
} as const;
export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

/** Donation payment lifecycle: pending → paid | failed */
export const DonationStatus = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
} as const;
export type DonationStatus =
  (typeof DonationStatus)[keyof typeof DonationStatus];

/** Receiver config toggle: active | inactive */
export const ReceiverConfigStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;
export type ReceiverConfigStatus =
  (typeof ReceiverConfigStatus)[keyof typeof ReceiverConfigStatus];

/** Donation mode on a greeting */
export const DonationMode = {
  NONE: "none",
  MANUAL: "manual",
  PLATFORM: "platform",
} as const;
export type DonationMode = (typeof DonationMode)[keyof typeof DonationMode];
