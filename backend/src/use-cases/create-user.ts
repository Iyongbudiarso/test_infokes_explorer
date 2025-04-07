import { UserRepository } from '../domain/repositories/user.repository'
import { UserCreatePayload } from '../domain/entities/user'
import { hashPassword } from '../utils/hash'
import { User } from '../domain/entities/user'

export class CreateUser {
  constructor(private userRepo: UserRepository) { }

  async execute(user: UserCreatePayload): Promise<User> {
    // Hash the password before saving it to the database
    const hashedPassword = await hashPassword(user.password)
    const newUser = await this.userRepo.create({ ...user, password: hashedPassword })
    return newUser
  }
}
