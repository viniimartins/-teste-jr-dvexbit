import type { TaskStatus } from '@prisma/client'
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import type { DecodedToken } from '@/types/decoded-token'

import { authenticateUser } from './utils/auth'

export async function GET(request: Request) {
  const decodedToken = authenticateUser(request) as DecodedToken
  const { searchParams } = new URL(request.url)

  const statusFilter = searchParams.get('status')

  const tasks = await prisma.task.findMany({
    where: {
      user_id: decodedToken.id,
      ...(statusFilter && { status: statusFilter as TaskStatus }),
    },
  })

  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const decodedToken = authenticateUser(request) as DecodedToken

  const { name, description } = await request.json()

  const newItem = await prisma.task.create({
    data: {
      name,
      description,
      user_id: decodedToken.id,
    },
  })

  return NextResponse.json(newItem, { status: 201 })
}
