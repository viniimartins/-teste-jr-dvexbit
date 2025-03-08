import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

import { env } from '@/env'
import prisma from '@/lib/prisma'

const SECRET_KEY = env.JWT_SECRET_KEY

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 },
    )
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash)

  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    SECRET_KEY,
    { expiresIn: '1h' },
  )

  return NextResponse.json(
    { message: 'Login successful', token },
    { status: 200 },
  )
}
