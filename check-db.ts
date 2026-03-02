import { prisma } from "./packages/worker/src/db/db";

async function check() {
  const acct1 = await prisma.instaAccount.findUnique({
    where: { webhookUserId: "17841477712620086" },
  });
  const acct2 = await prisma.instaAccount.findUnique({
    where: { instagramUserId: "17841477712620086" },
  });
  console.log("By webhookUserId:", acct1);
  console.log("By instagramUserId:", acct2);
  process.exit(0);
}

check().catch((e) => {
  console.error(e);
  process.exit(1);
});
