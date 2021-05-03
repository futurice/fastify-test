import { Prisma, PrismaClient } from '@prisma/client';

const users: Prisma.UsersCreateInput[] = [
  {
    name: 'Hessu Kypärä',
    uuid: 'fef01237-6f6a-4b12-83b5-18874624ba54',
    team: {
      connect: {
        name: 'TiTe',
      },
    },
  },
];

export const seed = (prisma: PrismaClient) => {
  return Promise.all(
    users.map(user =>
      prisma.users.upsert({
        where: { uuid: user.uuid },
        update: user,
        create: user,
      }),
    ),
  );
};
