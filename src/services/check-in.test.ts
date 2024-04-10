import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInService } from './check-in'
import { randomUUID } from 'crypto'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('CheckIn Service', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-1',
      title: 'BlueFit',
      description: null,
      phone: null,
      latitude: 1,
      longitude: 1,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: randomUUID(),
      gymId: 'gym-1',
      userLatitude: 1,
      userLongitude: 1,
    })

    expect(checkIn.user_id).toEqual(expect.any(String))
    expect(checkIn.gym_id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 1,
      userLongitude: 1,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-1',
        userLatitude: 1,
        userLongitude: 1,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 19, 8, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 1,
      userLongitude: 1,
    })

    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 1,
      userLongitude: 1,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in far from the gym', async () => {
    gymsRepository.items.push({
      id: 'gym-2',
      title: 'Smart Fit',
      phone: '',
      description: '',
      latitude: new Decimal(-9.6498827),
      longitude: new Decimal(-35.7093815),
    })

    await expect(() =>
      sut.execute({
        userId: randomUUID(),
        gymId: 'gym-2',
        userLatitude: -9.6633787,
        userLongitude: -35.7429842,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
