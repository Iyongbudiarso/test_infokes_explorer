export interface User {
  id: number
  name: string
  email: string
}

export interface UserCreatePayload {
  name: string
  email: string
  password: string
}
