import { prisma } from "../src/server/db/client";

async function main() {
  // const categories = ["FOOD", "TRANSPORT", "RENT", "UTILITY PAYMENT", "SALARY"];
  // console.log("main func");
  // await prisma.user.updateMany({
  //   data: {
  //     categories,
  //   },
  // });
  // const users = await prisma.user.findMany();
  // users.forEach(async (user) => {
  //   if (!user.isShowCurrentMonthBalance) {
  //     await prisma.user.update({
  //       where: {
  //         id: user.id,
  //       },
  //       data: {
  //         isShowLast30DaysBalance: true,
  //       },
  //     });
  //   }
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
