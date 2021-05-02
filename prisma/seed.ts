import { PrismaClient } from '@prisma/client';
import { seed as actionTypeSeed } from './seeds/actionTypes';
import { seed as guildsSeed } from './seeds/guilds';

const prisma = new PrismaClient();

const main = () => {
  return actionTypeSeed(prisma).then(() => guildsSeed(prisma));
};

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
