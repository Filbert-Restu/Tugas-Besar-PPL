import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getCookie } from '@/utils/getCookie';
import { parseToken } from '@/utils/parseToken';
import { isExpired } from '@/utils/isExpired';

export function requireAuth(request: NextRequest) {
  const token = getCookie(request, 'token');
  const payload = parseToken(token);

  if (!payload || isExpired(payload.exp)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
