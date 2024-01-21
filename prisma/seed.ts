import { hashPassword } from "~/services/user.server";
import { db } from "~/lib/db";

async function main() {
  const user = await db.user.upsert({
    where: { nik: "123123123" },
    update: {},
    create: {
      name: "Admin",
      nik: "123123123",
      password: hashPassword("123123123"),
      role: "Admin",
    },
  });

  const isTargetLocationExist = await db.targetLocation.findMany();
  if (isTargetLocationExist) {
    await db.targetLocation.deleteMany();
  }

  const targetInfos = await db.targetLocation.create({
    data: {
      name: "PT. Kalla Toyota Urip",
      lat: -5.1371751,
      lng: 119.4381947,
      radius: 50,
    },
  });

  console.log("Seed Data :",{ user, targetInfos });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async () => {
    await db.$disconnect();
    process.exit(1);
  });
