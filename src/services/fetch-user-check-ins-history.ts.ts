import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface FetchUserCheckInsHistoryServiceRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryServiceReponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
  // eslint-disable-next-line prettier/prettier
  constructor(private checkInRepository: CheckInsRepository) { }

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceReponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(userId, page)

    return { checkIns }
  }
}
