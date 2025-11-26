import type { NextRequest } from 'next/server';

export function getCookie(request: NextRequest, name: string) {
  return request.cookies.get(name)?.value || null;
}
