import { prisma } from "~/db/db.server";
import { undefined, z } from "zod";
import { json } from "@remix-run/node";

export async function getAllOpps() {
  const list = await prisma.opportunities.findMany({
    orderBy: [{ name: "asc" }],
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
  });
  return list;
}

export async function getAllOppsByOwner(oid) {
  const list = await prisma.orgs.findMany({
    where: { ownerId: oid },
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
    orderBy: [{ name: "asc" }],
  });
  return list;
}

export async function getLikeNameOpps(sp) {
  const list = await prisma.opportunities.findMany({
    where: {
      name: {
        contains: sp,
      },
    },
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
    orderBy: [{ name: "asc" }],
  });
  return list;
}

export async function getOppById(i: string) {
  const rval = await prisma.opportunities.findUnique({
    where: { id: i },
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
  });

  return rval;
}

function validateEdit(formData) {
  const schema = z.object({
    id: z.string(),
    name: z.string().min(3, { message: "Name is required" }),
    ownerId: z.string(),
    orgId: z.string().nullable(),
    personId: z.string().nullable(),
    statusChangeDate: z
      .string()
      .nullable()
      .transform((val) => {
        const p = Date.parse(val); // val ? true : false;
        return p;
      }),
    closeDate: z
      .string()
      .nullable()
      .transform((val) => {
        const p = Date.parse(val); // val ? true : false;
        return p;
      }),
    expectedOutcome: z.string().nullable(),
    closedOutcome: z.string().nullable(),
    activityDiscussion: z.string().nullable(),
    opportunityType: z.string().nullable(),
    opportunitySource: z.string().nullable(),
    opportunityStatus: z.string().nullable(),
    isActive: z.string().transform((val) => {
      const p = !!val; // val ? true : false;
      return p;
    }),

    description: z.string().nullable(),
  });

  const optional = schema.partial({
    orgId: true,
    personId: true,
    statusChangeDate: true,
    activityDiscussion: true,
    closeDate: true,
    expectedOutcome: true,
    closedOutcome: true,
    description: true,
    opportunityType: true,
    opportunitySource: true,
    opportunityStatus: true,
  });

  console.log("\n\nopp form data?: " + JSON.stringify(formData));

  const parsedData = optional.safeParse(formData);

  console.log("\n\nopp verified data?: " + JSON.stringify(parsedData));

  return parsedData;
}

function validateCreate(formData) {
  const schema = z.object({
    name: z.string().min(3, { message: "Name is required" }),
    ownerId: z.string(),
    orgId: z.string().nullable(),
    personId: z.string().nullable(),
    statusChangeDate: z
      .string()
      .nullable()
      .transform((val) => {
        const p = Date.parse(val); // val ? true : false;
        return p;
      }),
    closeDate: z
      .string()
      .nullable()
      .transform((val) => {
        const p = Date.parse(val); // val ? true : false;
        return p;
      }),
    expectedOutcome: z.string().nullable(),
    closedOutcome: z.string().nullable(),
    activityDiscussion: z.string().nullable(),
    opportunityType: z.string().nullable(),
    opportunitySource: z.string().nullable(),
    opportunityStatus: z.string().nullable(),
    isActive: z.string().transform((val) => {
      const p = !!val; // val ? true : false;
      return p;
    }),

    description: z.string().nullable(),
  });

  const optional = schema.partial({
    orgId: true,
    personId: true,
    statusChangeDate: true,
    closeDate: true,
    expectedOutcome: true,
    closedOutcome: true,
    description: true,
    activityDiscussion: true,
    opportunityType: true,
    opportunitySource: true,
    opportunityStatus: true,
  });

  console.log("\n\nopp form data?: " + JSON.stringify(formData));

  const parsedData = optional.safeParse(formData);

  console.log("\n\nopp verified data?: " + JSON.stringify(parsedData));

  return parsedData;
}

export async function updateOpp(formData) {
  const validatedData = validateEdit(formData);

  console.log("\n\nupdate opp form: " + JSON.stringify(formData));
  console.log(
    "\n\nupdate opp: " +
      JSON.stringify(validatedData) +
      " success:" +
      validatedData.success
  );

  if (validatedData.success == false) {
    console.log("\n\nreturning to previous");
    return { error: validatedData.error.format() };
  }

  console.log("\n\n\n should only be here if parsedata.sucess is true");
  const parsedData = validatedData.data;

  const data = {
    name: parsedData.name,
    ownerId: parsedData.ownerId,
    orgId: parsedData.orgId == "" ? undefined : parsedData.orgId,
    personId: parsedData.personId == "" ? undefined : parsedData.personId,
    statusChangeDate: parsedData.statusChangeDate,
    closeDate: parsedData.closeDate,
    expectedOutcome: parsedData.expectedOutcome,
    closedOutcome: parsedData.closedOutcome,
    description: parsedData.description,
    opportunityType:
      parsedData.opportunityType == "" ? undefined : parsedData.opportunityType,
    opportunitySource:
      parsedData.opportunitySource == ""
        ? undefined
        : parsedData.opportunitySource,
    opportunityStatus:
      parsedData.opportunityStatus == ""
        ? undefined
        : parsedData.opportunityStatus,
    isActive: parsedData.isActive,
  };

  const oid = parsedData.id;

  console.log("\n\nopp to update data: " + JSON.stringify(data));

  const rval = await prisma.opportunities.update({
    where: { id: oid },
    data: data,
  });

  console.log("\n\nopp after update data: " + JSON.stringify(rval));

  return rval;
}

export async function createOpp(formData) {
  const validatedData = validateCreate(formData);

  if (!validatedData.success) {
    return { error: validatedData.error.format() };
  }

  const parsedData = validatedData.data;

  console.log("\n\n org create: " + JSON.stringify(parsedData, null, 2));

  const data = {
    name: parsedData.name,
    ownerId: parsedData.ownerId,
    orgId: parsedData.orgId == "" ? null : parsedData.orgId,
    personId: parsedData.personId == "" ? null : parsedData.personId,
    statusChangeDate: parsedData.statusChangeDate,
    closeDate: parsedData.closeDate,
    expectedOutcome: parsedData.expectedOutcome,
    closedOutcome: parsedData.closedOutcome,
    description: parsedData.description,
    opportunityType:
      parsedData.opportunityType == "" ? null : parsedData.opportunityType,
    opportunitySource:
      parsedData.opportunitySource == "" ? null : parsedData.opportunitySource,
    opportunityStatus:
      parsedData.opportunityStatus == "" ? null : parsedData.opportunityStatus,
    isActive: parsedData.isActive,
  };

  console.log("\n\nopp to create data: " + JSON.stringify(data));

  const rval = await prisma.opportunities.create({
    data: data,
  });

  console.log("\n\nopp after insert data: " + JSON.stringify(rval));

  return rval;
}

export async function destroyOpp(pid: string) {
  console.log("\n\n delete org: " + pid + "\n\n");
  await prisma.opportunities.delete({
    where: {
      id: pid,
    },
  });

  return;
}
