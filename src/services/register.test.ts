import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '1234123',
    })

    // Espera que o id do usuário seja igual a qualquer valor do tipo string.
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const password = '12314123'

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password,
    })

    const isPasswordCorrectlyHashed = await compare(
      password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not able to register with same email twice.', async () => {
    const email = 'johndoe@exemple.com'

    const password = '12314123'

    await sut.execute({
      name: 'John Doe',
      email,
      password,
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
