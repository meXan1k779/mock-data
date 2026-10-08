import { NextResponse } from 'next/server';

// Prototype build: the app runs entirely on the in-browser mock backend
// (mocks/backend), so readiness no longer depends on the real API.
export async function GET() {
  return NextResponse.json({ status: 'ready', checks: { mock_backend: true } });
}
