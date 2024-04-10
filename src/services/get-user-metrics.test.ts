import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsService } from './get-user-metrics'
import { randomUUID } from 'node:crypto'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsService

describe('Get User Metrics Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsService(checkInsRepository)
  })

  it('should be able to get user metrics', async () => {
    await checkInsRepository.create({
      user_id: 'user-1',
      gym_id: randomUUID(),
    })

    const { checkInsCount } = await sut.execute({ userId: 'user-1' })

    expect(checkInsCount).toBe(1)
  })
})
