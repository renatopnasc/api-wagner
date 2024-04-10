import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileService } from '../get-user-profile'

export function makeGetUserProfile() {
  const usersRepository = new PrismaUsersRepository()
  const getUserProfile = new GetUserProfileService(usersRepository)

  return getUserProfile
}
