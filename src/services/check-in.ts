import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '../utils/get-distance-between-coordinates'

interface CheckInServiceRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInServiceResponse {
  checkIn: CheckIn
}

export class CheckInService {
  // eslint-disable-next-line prettier/prettier
  constructor(private checkInsRepository: CheckInsRepository, private gymsRepository: GymsRepository) { }

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) throw new ResourceNotFoundError()

    const distance = getDistanceBetweenCoordinates(
      { latitude: Number(gym.latitude), longitude: Number(gym.longitude) },
      { latitude: userLatitude, longitude: userLongitude },
    )

    const MAX_DISTACE_IN_KILOMETERS = 0.1
    if (distance > MAX_DISTACE_IN_KILOMETERS) throw new Error()

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay)
      throw new Error('Check In Already carried out on the day')

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
