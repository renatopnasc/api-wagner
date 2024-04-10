import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsService } from '../get-user-metrics'

export function makeGetUserMetrics() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const getUserMetricsService = new GetUserMetricsService(checkInsRepository)

  return getUserMetricsService
}
