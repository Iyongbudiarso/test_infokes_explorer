import { User, UserCreatePayload } from '../entities/user'

export interface UserRepository {
  findAll(): Promise<User[]>
  findById(id: number): Promise<User | null>
  create(user: UserCreatePayload): Promise<User>
  login(email: string, password: string): Promise<User | null>
}
