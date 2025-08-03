import { app } from './app';
import { prisma } from './prisma.client';

const main = async (): Promise<void> => {
  app.listen(3333, () => {
    console.log('server running on port 3333');
  });
};

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
