import { NextRequest, NextResponse } from "next/server";
import { viewPaste } from "@/app/lib/services/paste.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Paste ID is required" },
        { status: 400 }
      );
    }

    const result = await viewPaste(id);

    if (!result) {
      return NextResponse.json(
        { error: "Paste not found or no longer available" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      content: result.content,
      remaining_views: result.remaining_views,
      expires_at: result.expires_at,
    });
  } catch (error) {
    console.error("Error fetching paste:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
