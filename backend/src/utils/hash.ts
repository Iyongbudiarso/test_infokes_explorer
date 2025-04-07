import bcrypt from 'bcrypt'

/**
 * Hashes a password using bcrypt.
 * @param password - The password to hash.
 * @returns The hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || 'salt', 10)
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Compares a plain password with a hashed password.
 * @param password - The plain password.
 * @param hash - The hashed password.
 * @returns True if the passwords match, false otherwise.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}
