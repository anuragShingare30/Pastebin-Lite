import { NextRequest, NextResponse } from "next/server";
import { createPaste } from "@/app/lib/services/paste.service";
import { getBaseUrl } from "@/app/lib/utils/url";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    // Validate required fields - content must be a non-empty string
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "content is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Validate ttl_seconds: if present, must be an integer >= 1
    if (ttl_seconds !== undefined) {
      if (typeof ttl_seconds !== "number" || !Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return NextResponse.json(
          { error: "ttl_seconds must be an integer >= 1" },
          { status: 400 }
        );
      }
    }

    // Validate max_views: if present, must be an integer >= 1
    if (max_views !== undefined) {
      if (typeof max_views !== "number" || !Number.isInteger(max_views) || max_views < 1) {
        return NextResponse.json(
          { error: "max_views must be an integer >= 1" },
          { status: 400 }
        );
      }
    }

    const paste = await createPaste({ content, ttl: ttl_seconds, maxViews: max_views });

    // Build the shareable URL using deployed URL or fallback to request origin
    const baseUrl = getBaseUrl(request.nextUrl.origin);
    const url = `${baseUrl}/p/${paste.id}`;

    return NextResponse.json(
      {
        id: paste.id,
        url,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating paste:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
