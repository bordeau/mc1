import { PrismaClient } from "@prisma/client";
//import bcrypt from "bcryptjs";
var bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash("qwert", salt);
  await prisma.users.create({
    data: {
      username: "gumby",
      password: hashedPassword,
      role: "Admin",
      firstName: "Joe",
      lastName: "Gumby",
      email: "jg@example.com",
      phone: undefined,
      address: undefined,
      isActive: true,
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
