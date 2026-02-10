import db from "./db";

interface CreateNotificationParams {
  userId: string;
  message: string;
  redirectLink?: string;
  type?: "info" | "warning" | "view_limit_reached" | "slug_reclaimed" | "system";
}

export async function createNotification(params: CreateNotificationParams) {
  return db.notification.create({
    data: {
      userId: params.userId,
      message: params.message,
      redirectLink: params.redirectLink,
      type: params.type ?? "info",
    },
  });
}
