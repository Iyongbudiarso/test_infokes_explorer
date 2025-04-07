import { prisma } from "../src/infrastructure/db/prisma"
import { hashPassword } from "../src/utils/hash";

const prismaClient = prisma;

async function main() {
  const createUserPayload = {
    "name": "user1",
    "email": "user1@gmail.com",
    "password": await hashPassword("secret"),
  }
  await prismaClient.user.create({
    data: createUserPayload,
  });
  console.log('User created:', {
    name: createUserPayload.name,
    email: createUserPayload.email,
  });

  const createUserPayload2 = {
    "name": "user2",
    "email": "user2@gmail.com",
    "password": await hashPassword("secret"),
  }
  await prismaClient.user.create({
    data: createUserPayload2,
  });
  console.log('User created:', {
    name: createUserPayload2.name,
    email: createUserPayload2.email,
  });
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (error) => {
    console.error('Error seeding data:', error);
    await prismaClient.$disconnect();
    process.exit(1);
  });
