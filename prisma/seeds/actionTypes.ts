import { prisma, Prisma, PrismaClient } from '@prisma/client';

const actionTypes: Prisma.ActionTypesCreateInput[] = [
  {
    code: 'SIMA',
    name: 'Grab a sima',
    value: 1,
    cooldown: 5 * 60 * 1000,
  },
  {
    code: 'IMAGE',
    name: "Pics or didn't happen",
    value: 0,
    cooldown: 5 * 60 * 1000,
  },
  {
    code: 'TEXT',
    name: 'Comment',
    value: 0,
    cooldown: 10 * 1000,
  },
];

export const seed = (prisma: PrismaClient) => {
  return Promise.all(
    actionTypes.map(actionType =>
      prisma.actionTypes.upsert({
        where: { code: actionType.code },
        update: actionType,
        create: actionType,
      }),
    ),
  );
};
