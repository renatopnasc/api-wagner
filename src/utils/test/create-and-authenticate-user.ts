import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface CreateAndAuthenticateUserResponse {
  token: string
}

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
): Promise<CreateAndAuthenticateUserResponse> {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password_hash: await hash('123123', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@exemple.com',
    password: '123123',
  })

  const { token } = authResponse.body

  return { token }
}
