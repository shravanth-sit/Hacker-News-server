import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      username: 'john',
      password: 'hello',
      name: 'John Doe',
    },
  });

  const post = await prisma.post.create({
    data: {
      title: 'My first post',
      content: 'This is my first post',
      authorId: user.id,
    },
  });

  const posts = await prisma.post.findMany({
    orderBy: {
      createAt: 'desc',
    },
  });

  console.log(posts);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });