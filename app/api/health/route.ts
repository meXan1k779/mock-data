import { NextResponse } from 'next/server';

export async function GET() {
  // Просто возвращаем пустой ответ со статусом 200 для кубера
  return new NextResponse(null, { status: 200 });
}
