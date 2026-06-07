// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn/ui required utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Rate limiter using in-memory Map (upgrade to Redis for production scale)
// Allows `limit` requests per `windowMs` per `key`
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (entry.count >= limit) return false; // blocked

  entry.count++;
  return true; // allowed
}

// Format date for display
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

// Extract text from PDF buffer (server-side)
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Dynamic import — only runs on server
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text;
}

// Truncate text to max length
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Simple slug from string
export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
