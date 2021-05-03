import { PrismaClient } from '@prisma/client';
import { seed as actionTypeSeed } from './seeds/actionTypes';
import { seed as guildsSeed } from './seeds/guilds';
import { seed as userSeed } from './seeds/user';

const prisma = new PrismaClient();

const main = () => {
  return actionTypeSeed(prisma)
    .then(() => guildsSeed(prisma))
    .then(() => userSeed(prisma));
};

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
