import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import type { DecodedToken } from '@/types/decoded-token'

import { authenticateUser } from '../utils/auth'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const decodedToken = authenticateUser(request) as DecodedToken
    const { id } = await params

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
    const { id } = await params
    const { name, description } = await request.json()

    const updatedItem = await prisma.task.update({
      where: {
        id,
        user_id: decodedToken.id,
      },
      data: {
        name,
        description,
      },
    })

    return NextResponse.json(updatedItem, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'You do not have permission to perform this action.' },
      { status: 403 },
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params
    const { status } = await request.json()

    const decodedToken = authenticateUser(request) as DecodedToken

    const updatedItem = await prisma.task.update({
      where: { id },
      data: {
        status,
        user_id: decodedToken.id,
      },
    })

    return NextResponse.json(updatedItem, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'You do not have permission to perform this action.' },
      { status: 403 },
    )
  }
}
