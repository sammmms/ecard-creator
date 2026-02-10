import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return new NextResponse("Invalid file type. Allowed: PNG, JPEG, WebP", {
        status: 400,
      });
    }

    if (file.size > MAX_SIZE) {
      return new NextResponse("File too large. Maximum 2MB", { status: 400 });
    }

    const filename = `${session.user.id}_${Date.now()}_${crypto.randomUUID().slice(0, 8)}.jpg`;

    // Ensure uploads directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    // Always compress with sharp — resize max 1200px wide, JPEG quality 80
    const compressed = await sharp(rawBuffer)
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    await writeFile(path.join(UPLOAD_DIR, filename), compressed);

    return NextResponse.json({ url: `/api/uploads/${filename}` });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return new NextResponse("Upload failed", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { url } = await req.json();

    if (
      !url ||
      typeof url !== "string" ||
      (!url.startsWith("/uploads/") && !url.startsWith("/api/uploads/")) ||
      !url.includes(session.user.id)
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Handle both /uploads/filename and /api/uploads/filename formats
    const filename = url.replace(/^\/api\/uploads\//, "/uploads/");
    const filePath = path.join(process.cwd(), "public", filename);
    await unlink(filePath).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[UPLOAD_DELETE]", error);
    return new NextResponse("Delete failed", { status: 500 });
  }
}
