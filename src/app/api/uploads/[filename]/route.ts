import { NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Content type mapping
const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Security: Prevent path traversal attacks
    if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    // Construct safe file path
    const filePath = path.join(UPLOAD_DIR, filename);

    // Verify file is within uploads directory (extra security layer)
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(UPLOAD_DIR)) {
      return new NextResponse("Access denied", { status: 403 });
    }

    // Check if file exists
    try {
      await stat(filePath);
    } catch {
      return new NextResponse("File not found", { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filePath);

    // Determine content type from extension
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("[UPLOADS_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
