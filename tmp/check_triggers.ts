import { prisma } from "../src/server/db";

async function main() {
  const automations = await prisma.automation.findMany({
    take: 5,
    select: { triggerType: true, automationName: true },
  });
  console.log(JSON.stringify(automations, null, 2));
}

main().catch(console.error);
