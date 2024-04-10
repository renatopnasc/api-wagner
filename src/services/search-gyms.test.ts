import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsService } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsService

describe('Search Gyms Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsService(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Smart Fit',
      latitude: 1,
      longitude: 1,
    })

    await gymsRepository.create({
      title: 'Blue Fit',
      latitude: 1,
      longitude: 1,
    })

    const { gyms } = await sut.execute({ query: 'Smart', page: 1 })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Smart Fit',
      }),
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: 'Smart Fit',
        latitude: 1,
        longitude: 1,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Smart',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Smart Fit',
      }),
      expect.objectContaining({
        title: 'Smart Fit',
      }),
    ])
  })
})
