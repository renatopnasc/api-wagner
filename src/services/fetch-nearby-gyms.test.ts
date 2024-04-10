import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsService } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe('Fetch Nearby Gyms Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsService(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Smart Fit',
      latitude: -9.6482326,
      longitude: -35.7117418,
    })

    await gymsRepository.create({
      title: 'Blue Fit',
      latitude: -9.6327051,
      longitude: -35.7086948,
    })

    const { gyms } = await sut.execute({
      userLatitude: -9.6388824,
      userLongitude: -35.7104114,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Smart Fit',
      }),
      expect.objectContaining({
        title: 'Blue Fit',
      }),
    ])
  })

  it('should not be able to fetch for distant gyms', async () => {
    await gymsRepository.create({
      title: 'Smart Fit',
      latitude: -9.6583865,
      longitude: -35.7550434,
    })

    const { gyms } = await sut.execute({
      userLatitude: -9.6388824,
      userLongitude: -35.7104114,
    })

    expect(gyms).toHaveLength(0)
  })
})
