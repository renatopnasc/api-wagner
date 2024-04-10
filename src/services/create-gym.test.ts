import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymService } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })
  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'BlueFit',
      description: null,
      phone: null,
      latitude: -9.6633787,
      longitude: -35.7429842,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
