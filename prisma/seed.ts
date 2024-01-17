import { hashPassword } from "~/services/user.server";
import { db } from "~/lib/db";

async function main() {
  const zoel = await db.user.upsert({
    where: { nik: "123123123" },
    update: {},
    create: {
      name: "Zulmy Azhary AS",
      nik: "123123123",
      password: hashPassword("123123123"),
      role: "Admin",
    },
  });

  const targetInfos = await db.targetLocation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "PT. Kalla Toyota Urip",
      lat: -5.1371751,
      lng: 119.4381947,
      radius: 50,
    },
  });

  console.log({ zoel, targetInfos });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async () => {
    await db.$disconnect();
    process.exit(1);
  });
