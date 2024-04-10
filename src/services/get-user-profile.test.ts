import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserProfileService } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileService

describe('Get User Profile Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  it('should able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      id: 'user-1',
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password_hash: '123456',
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not able to get user profile with wrong ID', async () => {
    await expect(() =>
      sut.execute({ userId: 'user-1' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
