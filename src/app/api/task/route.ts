import type { TaskStatus } from '@prisma/client'
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import type { DecodedToken } from '@/types/decoded-token'

import { authenticateUser } from '../utils/auth'

export async function GET(request: Request) {
  const decodedToken = authenticateUser(request) as DecodedToken
  const { searchParams } = new URL(request.url)

  const status = searchParams.get('status')
  const name = searchParams.get('name')

  const tasks = await prisma.task.findMany({
    where: {
      user_id: decodedToken.id,
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(status && { status: status as TaskStatus }),
    },
  })

  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const decodedToken = authenticateUser(request) as DecodedToken

  const { name, description, status } = await request.json()

  const newTask = await prisma.task.create({
    data: {
      name,
      description,
      status,
      user_id: decodedToken.id,
    },
  })

  return NextResponse.json(newTask, { status: 201 })
}
