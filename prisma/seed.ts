import { prisma } from "../src/server/db/client";

async function main() {
  const userId = "clbhxdxof00009kw7i2evtb7i";
  await prisma.record.createMany({
    data: [
      {
        name: "Bread",
        amount: "10",
        currency: "GEL",
        userId,
      },
      {
        name: "Milk",
        amount: "3",
        currency: "GEL",
        userId,
      },
      {
        name: "Water",
        amount: "0.5",
        currency: "GEL",
        userId,
      },
    ],
  });
  // await prisma.user.createMany({
  //   data: [
  //     {
  //       email: "aaa@gmail.com",
  //       name: "aaa",
  //     },
  //   ],
  // });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
