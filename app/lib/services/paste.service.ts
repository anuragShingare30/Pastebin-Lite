import prisma from "@/app/lib/db";
import { Paste } from "@/app/generated/prisma/client";

export interface CreatePasteInput {
  content: string;
  ttl?: number; // Time to live in seconds
  maxViews?: number;
}

export interface PasteResult {
  id: string;
  content: string;
  createdAt: Date;
  expiresAt: Date | null;
  maxViews: number | null;
  viewCount: number;
}

export interface ViewPasteResult {
  content: string;
  remaining_views: number | null; // null if unlimited
  expires_at: string | null; // ISO string, null if no TTL
}

/**
 * Check if a paste is still available based on TTL and view limits
 */
export function isPasteAvailable(paste: Paste): boolean {
  // Check TTL expiry
  if (paste.expiresAt && new Date() > paste.expiresAt) {
    return false;
  }

  // Check view limit
  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    return false;
  }

  return true;
}

/**
 * Create a new paste
 */
export async function createPaste(input: CreatePasteInput): Promise<PasteResult> {
  const { content, ttl, maxViews } = input;

  // Calculate expiry time from TTL (seconds)
  const expiresAt = ttl ? new Date(Date.now() + ttl * 1000) : null;

  const paste = await prisma.paste.create({
    data: {
      content,
      expiresAt,
      maxViews: maxViews ?? null,
    },
  });

  return paste;
}

/**
 * Get a paste by ID without incrementing view count
 * Used for checking paste existence
 */
export async function getPasteById(id: string): Promise<Paste | null> {
  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  return paste;
}

/**
 * Get a paste and increment view count atomically
 * Returns null if paste doesn't exist or is unavailable
 */
export async function getPasteAndIncrementView(id: string): Promise<Paste | null> {
  // First, get the paste to check availability
  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) {
    return null;
  }

  // Check if paste is available BEFORE incrementing
  if (!isPasteAvailable(paste)) {
    return null;
  }

  // Increment view count atomically
  const updatedPaste = await prisma.paste.update({
    where: { id },
    data: {
      viewCount: { increment: 1 },
    },
  });

  return updatedPaste;
}

/**
 * Get paste for viewing - checks availability and increments view count
 * Returns formatted response with remaining_views and expires_at
 */
export async function viewPaste(id: string): Promise<ViewPasteResult | null> {
  const paste = await getPasteAndIncrementView(id);
  
  if (!paste) {
    return null;
  }

  // Calculate remaining views (null if unlimited)
  const remaining_views = paste.maxViews !== null 
    ? paste.maxViews - paste.viewCount 
    : null;

  // Format expires_at as ISO string (null if no TTL)
  const expires_at = paste.expiresAt 
    ? paste.expiresAt.toISOString() 
    : null;

  return {
    content: paste.content,
    remaining_views,
    expires_at,
  };
}
