import { prisma } from './prisma'
import { UserRepository } from '../../domain/repositories/user.repository'
import { User, UserCreatePayload } from '../../domain/entities/user'
import { comparePassword } from '@/utils/hash'

export class PrismaUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany()
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })) as User[]
  }
  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    return user ? {
      id: user.id,
      name: user.name,
      email: user.email,
    } as User : null
  }
  async create(user: UserCreatePayload): Promise<User> {
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password, // Assuming password is hashed before this step
      },
    })
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    } as User
  }
  async login(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    const isPasswordValid = user && await comparePassword(password, user.password || '')
    if (isPasswordValid) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      } as User
    }
    return null
  }
}
