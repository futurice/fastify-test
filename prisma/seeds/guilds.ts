import { Prisma, PrismaClient } from '@prisma/client';

const guilds: Prisma.GuildsCreateInput[] = [
  {
    name: 'TiTe',
    logo: '',
  },
  {
    name: 'Skilta',
    logo: '',
  },
  {
    name: 'Autek',
    logo: '',
  },
  {
    name: 'Bioner',
    logo: '',
  },
  {
    name: 'Hiukkanen',
    logo: '',
  },
  {
    name: 'Indecs',
    logo: '',
  },
  {
    name: 'KoRK',
    logo: '',
  },
  {
    name: 'Man@ger',
    logo: '',
  },
  {
    name: 'MIK',
    logo: '',
  },
  {
    name: 'TamArk',
    logo: '',
  },
  {
    name: 'TARAKI',
    logo: '',
  },
  {
    name: 'YKI',
    logo: '',
  },
  {
    name: 'TeLE',
    logo: '',
  },
  {
    name: 'ESN INTO',
    logo: '',
  },
  {
    name: 'Wapputiimi',
    logo: '',
  },
];

export const seed = (prisma: PrismaClient) => {
  return Promise.all(
    guilds.map(guild =>
      prisma.guilds.upsert({
        where: { name: guild.name },
        update: guild,
        create: guild,
      }),
    ),
  );
};
