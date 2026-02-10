/**
 * Payment Service — abstracts all payment operations.
 *
 * Currently uses MOCK payments (directly marks as paid).
 * When integrating a real payment provider (e.g. Xendit):
 *   1. Update `createPayment` to call the provider API and return a real checkout URL.
 *   2. Update `completePayment` to be called from the webhook handler
 *      after the provider confirms payment.
 *   3. The rest of the app stays unchanged — only this file needs to change.
 */

import db from "@/lib/db";
import { getExpiryDate } from "@/lib/expiry";
import { GreetingStatus, PaymentStatus, PaymentType } from "@/lib/constants";

interface PaymentResult {
  success: boolean;
  paymentId: string;
  greeting: { id: string; status: string; isTrial: boolean };
}

/**
 * Create a payment record and immediately mark it as paid (mock).
 *
 * TODO: When integrating Xendit:
 *   - Call Xendit Invoice API to create an invoice
 *   - Store the returned externalRef and checkoutUrl
 *   - Return { paymentId, checkoutUrl } and redirect the user
 *   - Do NOT call `completePayment` here — wait for webhook
 */
export async function createAndCompletePayment(
  userId: string,
  greetingId: string,
  amount: number,
): Promise<PaymentResult> {
  // Check for existing pending purchase/upgrade payment
  const existing = await db.payment.findFirst({
    where: { greetingId, type: { in: [PaymentType.PURCHASE, PaymentType.UPGRADE] }, status: PaymentStatus.PENDING },
  });

  const isUpgrade = !!(await db.greeting.findUnique({
    where: { id: greetingId },
    select: { isTrial: true },
  }))?.isTrial;

  const paymentType = isUpgrade ? PaymentType.UPGRADE : PaymentType.PURCHASE;

  const payment = existing
    ? await db.payment.update({
        where: { id: existing.id },
        data: { amount, status: PaymentStatus.PAID, type: paymentType },
      })
    : await db.payment.create({
        data: {
          userId,
          greetingId,
          amount,
          status: PaymentStatus.PAID, // Mock: directly paid
          type: paymentType,
          // TODO: Set these from Xendit response
          // externalRef: xenditInvoice.external_id,
          // checkoutUrl: xenditInvoice.invoice_url,
        },
      });

  // Mark greeting as published and clear trial status
  const greeting = await db.greeting.update({
    where: { id: greetingId },
    data: {
      status: GreetingStatus.PUBLISHED,
      isTrial: false,
      trialExpiresAt: null,
      expiresAt: getExpiryDate(new Date()),
    },
  });

  return {
    success: true,
    paymentId: payment.id,
    greeting: {
      id: greeting.id,
      status: greeting.status,
      isTrial: greeting.isTrial,
    },
  };
}

/**
 * Complete a pending payment (called from webhook in real integration).
 *
 * TODO: When integrating Xendit:
 *   - Verify the webhook signature
 *   - Match by externalRef from the webhook payload
 *   - Only mark as paid if Xendit status is "PAID" or "SETTLED"
 */
export async function completePayment(paymentId: string): Promise<PaymentResult> {
  const payment = await db.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === PaymentStatus.PAID) {
    throw new Error("Payment already completed");
  }

  const updatedPayment = await db.payment.update({
    where: { id: paymentId },
    data: { status: PaymentStatus.PAID },
  });

  const greeting = await db.greeting.update({
    where: { id: updatedPayment.greetingId },
    data: {
      status: GreetingStatus.PUBLISHED,
      isTrial: false,
      trialExpiresAt: null,
      expiresAt: getExpiryDate(new Date()),
    },
  });

  return {
    success: true,
    paymentId: updatedPayment.id,
    greeting: {
      id: greeting.id,
      status: greeting.status,
      isTrial: greeting.isTrial,
    },
  };
}

/**
 * Extend a greeting's expiry by paying the extension fee.
 *
 * TODO: When integrating Xendit:
 *   - Create an invoice for the extension price
 *   - Only extend after webhook confirms payment
 */
export async function extendGreeting(
  userId: string,
  greetingId: string,
  amount: number,
  extensionMonths: number,
): Promise<PaymentResult> {
  // Create a new payment record for the extension
  const payment = await db.payment.create({
    data: {
      userId,
      greetingId,
      amount,
      status: PaymentStatus.PAID, // Mock: directly paid
      type: PaymentType.EXTENSION,
    },
  });

  // Extend from the later of current expiresAt or now
  const greeting = await db.greeting.findUniqueOrThrow({
    where: { id: greetingId },
    select: { expiresAt: true },
  });

  const baseDate =
    greeting.expiresAt && greeting.expiresAt > new Date()
      ? greeting.expiresAt
      : new Date();

  const newExpiry = new Date(baseDate);
  newExpiry.setMonth(newExpiry.getMonth() + extensionMonths);

  const updated = await db.greeting.update({
    where: { id: greetingId },
    data: {
      expiresAt: newExpiry,
      isExpired: false,
    },
  });

  return {
    success: true,
    paymentId: payment.id,
    greeting: {
      id: updated.id,
      status: updated.status,
      isTrial: updated.isTrial,
    },
  };
}

/**
 * Mark a payment as failed.
 *
 * TODO: When integrating Xendit:
 *   - Called from webhook when payment expires or fails
 */
export async function failPayment(paymentId: string) {
  return db.payment.update({
    where: { id: paymentId },
    data: { status: PaymentStatus.FAILED },
  });
}
