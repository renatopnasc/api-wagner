import { Gym, Prisma } from '@prisma/client'

export interface FindNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findManyNearby(params: FindNearbyParams): Promise<Gym[]>
  findById(gymId: string): Promise<Gym | null>
  searchManyByQuery(query: string, page: number): Promise<Gym[]>
}
