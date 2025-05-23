import { UserRepository } from '../domain/repositories/user.repository'

export class GetUsers {
  constructor(private userRepo: UserRepository) { }

  async execute() {
    return this.userRepo.findAll()
  }
}
