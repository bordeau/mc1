import { PrismaClient } from "@prisma/client";
//import bcrypt from "bcryptjs";
const bcrypt = require("bcryptjs");

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

  await Promise.all([
    prisma.opportunityStatuses.createMany({
      data: [
        {
          id: "Open Lead - Not Contacted",
          isActive: true,
          orderBy: 90,
          type: "L",
        },
        {
          id: "Working Lead",
          isActive: true,
          orderBy: 95,
          type: "L",
        },
        {
          id: "Closed Lead - Discontinued",
          isActive: true,
          orderBy: 99,
          type: "L",
        },
        {
          id: "Lead Converted to Opportunity",
          isActive: true,
          orderBy: 100,
          type: "O",
        },
        {
          id: "Initiating Opportunity",
          isActive: true,
          orderBy: 105,
          type: "O",
        },
        { id: "Qualification", isActive: true, orderBy: 110, type: "O" },
        {
          id: "Proposal or Price Quote",
          isActive: true,
          orderBy: 120,
          type: "O",
        },
        {
          id: "Negotiation and Review",
          isActive: true,
          orderBy: 130,
          type: "O",
        },
        { id: "Closed Won", isActive: true, orderBy: 200, type: "O" },
        { id: "Closed Lost", isActive: true, orderBy: 210, type: "O" },
      ],
    }),

    prisma.opportunityTypes.createMany({
      data: [
        { id: "Customer", isActive: true, orderBy: 95 },
        { id: "Partner", isActive: true, orderBy: 110 },
        { id: "New Customer", isActive: true, orderBy: 90 },
        { id: "New Partnership", isActive: true, orderBy: 100 },
      ],
    }),

    prisma.opportunitySources.createMany({
      data: [
        { id: "Referral - Other", isActive: true, orderBy: 105 },
        { id: "Referral - Internal", isActive: true, orderBy: 100 },
        { id: "Referral - Partner", isActive: true, orderBy: 100 },
        { id: "Referral - Customer", isActive: true, orderBy: 100 },

        { id: "Inquiry - Phone", isActive: true, orderBy: 110 },
        { id: "Inquiry - Email", isActive: true, orderBy: 110 },
        { id: "Inquiry - Web", isActive: true, orderBy: 110 },
        { id: "Other", isActive: true, orderBy: 130 },
        { id: "Show or Presentation", isActive: true, orderBy: 120 },
      ],
    }),

    prisma.orgIndustries.createMany({
      data: [
        { id: "Agriculture", isActive: true, orderBy: 100 },
        { id: "Construction", isActive: true, orderBy: 100 },
        { id: "Consulting", isActive: true, orderBy: 100 },
        { id: "Education", isActive: true, orderBy: 100 },
        { id: "Energy", isActive: true, orderBy: 100 },
        { id: "Entertainment", isActive: true, orderBy: 100 },
        { id: "Family", isActive: true, orderBy: 100 },
        { id: "Finance", isActive: true, orderBy: 100 },
        { id: "Government", isActive: true, orderBy: 100 },
        { id: "Healthcare", isActive: true, orderBy: 100 },
        { id: "Hospitality", isActive: true, orderBy: 100 },
        { id: "Industrial", isActive: true, orderBy: 100 },
        { id: "Insurance", isActive: true, orderBy: 100 },
        { id: "Media", isActive: true, orderBy: 100 },
        { id: "Not For Profit", isActive: true, orderBy: 100 },
        { id: "Retail", isActive: true, orderBy: 100 },
        { id: "Logistics", isActive: true, orderBy: 100 },
        { id: "Technology", isActive: true, orderBy: 100 },
        { id: "Utilities", isActive: true, orderBy: 100 },
        { id: "Other", isActive: true, orderBy: 200 },
      ],
    }),

    prisma.orgTypes.createMany({
      data: [
        { id: "Prospect", isActive: true, orderBy: 90 },
        { id: "Customer", isActive: true, orderBy: 100 },
        { id: "Partner", isActive: true, orderBy: 100 },
        { id: "Other", isActive: true, orderBy: 200 },
      ],
    }),
  ]);
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
