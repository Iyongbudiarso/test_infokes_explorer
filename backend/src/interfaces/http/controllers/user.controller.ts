import { PrismaUserRepository } from '@/infrastructure/db/user.repo'
import { GetUsers } from '@/use-cases/get-users'
import { CreateUser } from '@/use-cases/create-user'
import { LoginUser } from '@/use-cases/login-user'

const repo = new PrismaUserRepository()

export const getAllUsers = async () => {
  const useCase = new GetUsers(repo)
  return await useCase.execute()
}

export const createUser = async ({ body }: any) => {
  const useCase = new CreateUser(repo)
  return await useCase.execute(body)
}

export const loginUser = async ({ body }: any) => {
  const useCase = new LoginUser(repo)
  return await useCase.execute(body.email, body.password)
}
