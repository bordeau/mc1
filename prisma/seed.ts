import { PrismaClient } from "@prisma/client";
//import bcrypt from "bcryptjs";
// var bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  //  const salt = bcrypt.genSaltSync(10);
  //  const hashedPassword = await bcrypt.hash("qwert", salt);
  /*
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
*/

  await Promise.all([
    prisma.opportunityStatuses.createMany({
      data: [
        { id: "Open Lead - Not Contacted" },
        { id: "Working Lead - Contacted" },
        { id: "Closed Lead - Discontinued" },
        { id: "Initiating Opportunity" },
        { id: "Qualification" },
        { id: "Proposal/Price Quote" },
        { id: "Negotiation/Review" },
        { id: "Closed Won" },
        { id: "Closed Lost" },
      ],
    }),

    prisma.opportunityTypes.createMany({
      data: [
        { id: "Existing Customer - Upgrade" },
        { id: "Existing Customer - Replacement" },
        { id: "Existing Customer - Downgrade" },
        { id: "Existing Customer - Partnership" },
        { id: "New Customer" },
      ],
    }),

    prisma.opportunitySources.createMany({
      data: [
        { id: "External Referral" },
        { id: "Internal Referral" },
        { id: "Phone Inquiry" },
        { id: "Email Inquiry" },
        { id: "Web Inquiry" },
        { id: "Partner Referral" },
        { id: "Purchased List" },
        { id: "Other" },
        { id: "Show or Presentation" },
        { id: "Word of Mouth" },
      ],
    }),

    prisma.orgIndustries.createMany({
      data: [
        { id: "Agriculture" },
        { id: "Apparel" },
        { id: "Banking" },
        { id: "Biotechnology" },
        { id: "Chemicals" },
        { id: "Communications" },
        { id: "Construction" },
        { id: "Consulting" },
        { id: "Education (K-12)" },
        { id: "Education (Beyond K-12)" },
        { id: "Electronics" },
        { id: "Energy" },
        { id: "Engineering" },
        { id: "Entertainment" },
        { id: "Family" },
        { id: "Finance" },
        { id: "Food & Beverage" },
        { id: "Government" },
        { id: "Healthcare" },
        { id: "Hospitality" },
        { id: "Insurance" },
        { id: "Manufacturing" },
        { id: "Media" },
        { id: "Not For Profit" },
        { id: "Recreation" },
        { id: "Retail" },
        { id: "Logistics" },
        { id: "Technology" },
        { id: "Telecommunications" },
        { id: "Utilities" },
        { id: "Other" },
      ],
    }),

    prisma.orgTypes.createMany({
      data: [
        { id: "Prospect" },
        { id: "Customer - Direct" },
        { id: "Customer - Channel" },
        { id: "Channel Partner / Reseller" },
        { id: "Installation Partner" },
        { id: "Technology Partner" },
        { id: "Other" },
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
