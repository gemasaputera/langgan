import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> }
) {
  const resolvedParams = await params;
  return auth.handler(
    new Request(new URL(request.url, request.nextUrl.origin), {
      method: request.method,
      headers: request.headers,
      body: request.method !== "GET" && request.method !== "HEAD"
        ? await request.blob()
        : undefined,
    })
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> }
) {
  const resolvedParams = await params;
  return auth.handler(
    new Request(new URL(request.url, request.nextUrl.origin), {
      method: request.method,
      headers: request.headers,
      body: await request.blob(),
    })
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> }
) {
  const resolvedParams = await params;
  return auth.handler(
    new Request(new URL(request.url, request.nextUrl.origin), {
      method: request.method,
      headers: request.headers,
      body: await request.blob(),
    })
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> }
) {
  const resolvedParams = await params;
  return auth.handler(
    new Request(new URL(request.url, request.nextUrl.origin), {
      method: request.method,
      headers: request.headers,
    })
  );
}
