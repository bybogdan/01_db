import { prisma } from "../src/server/db/client";

async function main() {
  const categories = ["FOOD", "TRANSPORT", "RENT", "UTILITY PAYMENT", "SALARY"];
  console.log("main func");
  await prisma.user.updateMany({
    data: {
      categories,
    },
  });
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
