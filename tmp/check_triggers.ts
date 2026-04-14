import { prisma } from "../src/server/db";

async function main() {
  try {
    const automations = await prisma.automation.findMany({
      take: 5,
      select: { triggerType: true, automationName: true },
    });
    console.log(JSON.stringify(automations, null, 2));
  } catch (err) {
    console.error("Execution failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
