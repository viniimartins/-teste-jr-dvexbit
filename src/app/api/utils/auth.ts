import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

import { env } from '@/env'
import type { DecodedToken } from '@/types/decoded-token'

export const authenticateUser = (
  request: Request,
): DecodedToken | NextResponse => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json(
      { message: 'User is not authenticated. Token is required.' },
      { status: 401 },
    )
  }

  try {
    return jwt.verify(token, env.JWT_SECRET_KEY) as DecodedToken
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { message: 'Token has expired. Please login again.' },
        { status: 401 },
      )
    }
    return NextResponse.json(
      { message: 'Invalid token. User is not authenticated.' },
      { status: 401 },
    )
  }
}
