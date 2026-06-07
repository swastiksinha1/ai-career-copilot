// src/app/api/applications/route.ts
// Full CRUD for application tracker

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, ApplicationData } from "@/types";

// GET — fetch all applications for the user
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ success: false, data: [] });

    const applications = await prisma.application.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    console.error("[applications GET]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// POST — create new application
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { company, role, jobUrl, status, notes, location, isRemote } = body;

    if (!company || !role) {
      return NextResponse.json({ success: false, error: "company and role are required" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        userId: user.id,
        company,
        role,
        jobUrl: jobUrl || null,
        status: status || "APPLIED",
        notes: notes || null,
        location: location || null,
        isRemote: isRemote || false,
      },
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error) {
    console.error("[applications POST]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// PATCH — update status or notes
export async function PATCH(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });

    // Verify ownership
    const existing = await prisma.application.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Auto-set interviewAt when status changes to INTERVIEW
    if (updates.status === "INTERVIEW" && !existing.interviewAt) {
      updates.interviewAt = new Date();
    }
    if (updates.status === "OFFER" && !existing.offerAt) {
      updates.offerAt = new Date();
    }

    const updated = await prisma.application.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[applications PATCH]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// DELETE — remove application
export async function DELETE(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });

    // Verify ownership before delete
    const existing = await prisma.application.findFirst({ where: { id, userId: user.id } });
    if (!existing) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    await prisma.application.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[applications DELETE]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
