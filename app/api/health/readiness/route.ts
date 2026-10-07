import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    content_api_endpoint: await checkEndpointReachability(),
  };

  if (!checks.content_api_endpoint) {
    return NextResponse.json({ status: 'not_ready', checks }, { status: 503 });
  }

  return NextResponse.json({ status: 'ready', checks });
}

async function checkEndpointReachability(): Promise<boolean> {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000);

    const response = await fetch('https://edu-api.finex.co.id/api/content?page=0', {
      method: 'GET',
      signal: controller.signal,
    });

    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}
