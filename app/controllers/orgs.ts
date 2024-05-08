import { prisma } from "~/db/db.server.ts";
import { z } from "zod";
import { json } from "@remix-run/node";

export async function getAllOrgs() {
  const orgs = await prisma.orgs.findMany({
    orderBy: [{ name: "asc" }],
    include: {
      personsOrgs: true,
      orgIndustries: true,
      orgTypes: true,
    },
  });
  return orgs;
}

export async function getAllActiveOrgs() {
  const orgs = await prisma.orgs.findMany({
    where: { isActive: true },
    orderBy: [{ name: "asc" }],
    include: {
      personsOrgs: true,
      orgIndustries: true,
      orgTypes: true,
    },
  });
  return orgs;
}

export async function getAllOrgsByOwner(oid) {
  const orgs = await prisma.orgs.findMany({
    where: { ownerId: oid },
    orderBy: [{ name: "asc" }],
  });
  return orgs;
}

export async function getLikeNameOrgs(sp) {
  const orgs = await prisma.orgs.findMany({
    where: {
      name: {
        contains: sp,
      },
    },
    include: {
      personsOrgs: true,
      orgIndustries: true,
      orgTypes: true,
    },
    orderBy: [{ name: "asc" }],
  });
  return orgs;
}

export async function getOrgById(i: string) {
  const rval = await prisma.orgs.findUnique({
    where: { id: i },
    include: {
      personsOrgs: { include: { person: true } },
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
    addressType: z.string().nullable(),
    street1: z.string().nullable(),
    street2: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    zip: z.string().nullable(),
    country: z.string().nullable(),
    orgType: z.string().nullable(),
    isActive: z.string().transform((val) => {
      const p = !!val; // val ? true : false;
      return p;
    }),
    orgIndustry: z.string().nullable(),
    website: z.string().nullable(),
    description: z.string().nullable(),
  });

  const optional = schema.partial({
    addressType: true,
    street1: true,
    street2: true,
    city: true,
    state: true,
    zip: true,
    country: true,
    orgType: true,
    orgIndustry: true,
    website: true,
    description: true,
  });

  console.log("\n\norg form data?: " + JSON.stringify(formData));

  const parsedData = optional.safeParse(formData);

  console.log("\n\norg verified data?: " + JSON.stringify(parsedData));

  return parsedData;
}

function validateCreate(formData) {
  const schema = z.object({
    name: z.string().min(3, { message: "Name is required" }),
    ownerId: z.string(),
    addressType: z.string().nullable(),
    street1: z.string().nullable(),
    street2: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    zip: z.string().nullable(),
    country: z.string().nullable(),
    orgType: z.string().nullable(),
    isActive: z.string().transform((val) => {
      const p = !!val; // val ? true : false;
      return p;
    }),
    orgIndustry: z.string().nullable(),
    website: z.string().nullable(),
    description: z.string().nullable(),
  });

  const optional = schema.partial({
    addressType: true,
    street1: true,
    street2: true,
    city: true,
    state: true,
    zip: true,
    country: true,
    orgType: true,
    orgIndustry: true,
    website: true,
    description: true,
  });

  console.log("\n\norg form data?: " + JSON.stringify(formData));

  const parsedData = optional.safeParse(formData);

  console.log("\n\norg verified data?: " + JSON.stringify(parsedData));

  return parsedData;
}

export async function updateOrg(formData) {
  const validatedData = validateEdit(formData);

  console.log("\n\nupdate org form: " + JSON.stringify(formData));
  console.log(
    "\n\nupdate org: " +
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

  const address = JSON.stringify({
    addressType: parsedData.addressType,
    street1: parsedData.street1,
    street2: parsedData.street2,
    city: parsedData.city,
    state: parsedData.state,
    zip: parsedData.zip,
    country: parsedData.country,
  });

  const data = {
    name: parsedData.name,
    orgType: parsedData.orgType,
    orgIndustry: parsedData.orgIndustry,
    address: address,
    ownerId: parsedData.ownerId,
    website: parsedData.website,
    description: parsedData.description,
    isActive: parsedData.isActive,
  };

  const oid = parsedData.id;

  console.log("\n\norg to update data: " + JSON.stringify(data));

  const rval = await prisma.orgs.update({
    where: { id: oid },
    data: data,
  });

  return rval;
}

export async function createOrg(formData) {
  const validatedData = validateCreate(formData);

  if (!validatedData.success) {
    return { error: validatedData.error.format() };
  }

  const parsedData = validatedData.data;

  const address = JSON.stringify({
    addressType: parsedData.addressType,
    street1: parsedData.street1,
    street2: parsedData.street2,
    city: parsedData.city,
    state: parsedData.state,
    zip: parsedData.zip,
    country: parsedData.country,
  });

  const data = {
    name: parsedData.name,
    orgType: parsedData.orgType,
    orgIndustry: parsedData.orgIndustry,
    address: address,
    ownerId: parsedData.ownerId,
    website: parsedData.website,
    description: parsedData.description,
    isActive: parsedData.isActive,
  };

  console.log("\n\norg to create data: " + JSON.stringify(data));

  const rval = await prisma.orgs.create({
    data: data,
  });

  return rval;
}

export async function destroyOrg(pid: string) {
  console.log("\n\n delete org: " + pid + "\n\n");
  await prisma.orgs.delete({
    where: {
      id: pid,
    },
  });

  return;
}
