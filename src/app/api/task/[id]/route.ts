import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import type { DecodedToken } from '@/types/decoded-token'

import { authenticateUser } from '../../utils/auth'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const decodedToken = authenticateUser(request) as DecodedToken
    const { id } = params

    await prisma.task.delete({
      where: {
        id,
        user_id: decodedToken.id,
      },
    })

    return NextResponse.json({ status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'You do not have permission to perform this action.' },
      { status: 403 },
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const decodedToken = authenticateUser(request) as DecodedToken
    const { id } = params
    const { name, description, status } = await request.json()

    const updatedTask = await prisma.task.update({
      where: {
        id,
        user_id: decodedToken.id,
      },
      data: {
        name,
        description,
        status,
      },
    })

    return NextResponse.json(updatedTask, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'You do not have permission to perform this action.' },
      { status: 403 },
    )
  }
}
