import { randomUUID } from 'node:crypto'
import { FindNearbyParams, GymsRepository } from '../gyms-repository'
import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude as string),
      longitude: new Decimal(data.longitude as string),
    }

    this.items.push(gym)

    return gym
  }

  async findById(gymId: string) {
    const gym = this.items.find((item) => item.id === gymId)

    if (!gym) return null

    return gym
  }

  async findManyNearby(params: FindNearbyParams) {
    const gyms = this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
        },
      )

      const MAX_DISTANCE_IN_KILOMETERS = 2.5

      return distance <= MAX_DISTANCE_IN_KILOMETERS
    })

    return gyms
  }

  async searchManyByQuery(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .splice((page - 1) * 20, page * 20)
  }
}
