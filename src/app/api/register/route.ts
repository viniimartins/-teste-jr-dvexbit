import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const { email, name, password } = await request.json()

  if (!email || !name || !password) {
    return NextResponse.json(
      { error: 'All fields (email, name and password are required' },
      { status: 400 },
    )
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (existingUser) {
    return NextResponse.json(
      { error: 'Email is already taken' },
      { status: 400 },
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password_hash: hashedPassword,
      },
    })

    return NextResponse.json(
      { message: 'User registered successfully', user },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: `Error registering user ${error}` },
      { status: 500 },
    )
  }
}
