import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenantId: string; filename: string }> }
) {
  const resolvedParams = await params;
  const filePath = join(process.cwd(), "public", "uploads", resolvedParams.tenantId, resolvedParams.filename);

  try {
    const fileBuffer = await readFile(filePath);
    
    const ext = resolvedParams.filename.split('.').pop()?.toLowerCase();
    let contentType = "image/jpeg";
    if (ext === "png") contentType = "image/png";
    if (ext === "webp") contentType = "image/webp";
    if (ext === "gif") contentType = "image/gif";
    if (ext === "svg") contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store, max-age=0", // Anti-caché estricto
      },
    });
  } catch (error) {
    return new NextResponse("Not Found", { status: 404 });
  }
}