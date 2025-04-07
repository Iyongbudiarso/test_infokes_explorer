import jwt from 'jsonwebtoken'
import { UserRepository } from '../domain/repositories/user.repository'

export class LoginUser {
  constructor(private userRepo: UserRepository) { }

  async execute(email: string, password: string): Promise<any> {
    // Validate the email and password
    if (!email || !password) {
      throw new Error('Email and password are required')
    }
    // Check if the user exists and the password is correct
    const user = await this.userRepo.login(email, password)
    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Return jwt token
    const token = this.generateToken(user)
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    }
  }

  private generateToken(user: any): string {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret')
  }
}
