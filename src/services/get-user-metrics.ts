import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsServiceRequest {
  userId: string
}

interface GetUserMetricsServiceResponse {
  checkInsCount: number
}

export class GetUserMetricsService {
  // eslint-disable-next-line prettier/prettier
  constructor(private checkInsRepository: CheckInsRepository) { }

  async execute({
    userId,
  }: GetUserMetricsServiceRequest): Promise<GetUserMetricsServiceResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}
