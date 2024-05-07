import { prisma } from "~/db/db.server.ts";
import { z } from "zod";
import { json } from "@remix-run/node";

export async function findPersonOrgsByPersonId(pid: string) {
  const rval = await prisma.personsOrgs.findMany({
    where: { personId: pid },
    include: { org: true, person: true },
  });

  return rval;
}

export async function findPersonOrgsByOrgId(oid: string) {
  const rval = await prisma.personsOrgs.findMany({
    where: { orgId: oid },
    include: { org: true, person: true },
  });

  return rval;
}

export async function getPersonOrgById(id: string) {
  const rval = await prisma.personsOrgs.findUnique({
    where: {
      id: id,
    },
    include: { org: true, person: true },
  });

  return rval;
}

function validateEdit(formData) {
  const schema = z.object({
    id: z.string(),
    title: z.string().nullable(),
    subOrg: z.string().nullable(),
    email: z.union([z.string().email().nullable(), z.literal("")]),
    phone: z.string().nullable(),
    addressType: z.string().nullable(),
    street1: z.string().nullable(),
    street2: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    zip: z.string().nullable(),
    country: z.string().nullable(),
    description: z.string().nullable(),
  });

  const optional = schema.partial({
    subOrg: true,
    title: true,
    email: true,
    phone: true,
    addressType: true,
    street1: true,
    street2: true,
    city: true,
    state: true,
    zip: true,
    country: true,
    description: true,
  });

  const parseddata = optional.safeParse(formData);

  console.log("\n\nperson verified data?: " + JSON.stringify(parseddata));

  return parseddata;
}

function validateCreate(formData) {
  const schema = z.object({
    personId: z.string(),
    orgId: z.string(),
    title: z.string().nullable(),
    subOrg: z.string().nullable(),
    email: z.union([z.string().email().nullable(), z.literal("")]),
    phone: z.string().nullable(),
    addressType: z.string().nullable(),
    street1: z.string().nullable(),
    street2: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    zip: z.string().nullable(),
    country: z.string().nullable(),
    description: z.string().nullable(),
  });

  const optional = schema.partial({
    subOrg: true,
    title: true,
    email: true,
    phone: true,
    addressType: true,
    street1: true,
    street2: true,
    city: true,
    state: true,
    zip: true,
    country: true,
    description: true,
  });

  const parseddata = optional.safeParse(formData);

  console.log("\n\nperson verified data?: " + JSON.stringify(parseddata));

  return parseddata;
}

export async function updatePersonOrg(formdata) {
  const validatedData = validateEdit(formdata);

  console.log(
    "\n\nupdate person: " +
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
    address_type: parsedData.addressType,
    street1: parsedData.street1,
    street2: parsedData.street2,
    city: parsedData.city,
    state: parsedData.state,
    zip: parsedData.zip,
    country: parsedData.country,
  });

  const data = {
    title: parsedData.title,
    subOrg: parsedData.subOrg,
    email: parsedData.email,
    phone: parsedData.phone,
    address: address,
    description: parsedData.description,
  };

  const id = parsedData.id;

  console.log(
    "\n\nperson org to update data: " + JSON.stringify(data, null, 2)
  );

  const rval = await prisma.personsOrgs.update({
    where: {
      id: id,
    },
    data: data,
  });

  return rval;
}

export async function createPersonOrg(formdata) {
  console.log("\n\ncreatepersonOrg formdata: " + JSON.stringify(formdata));

  const validatedData = validateCreate(formdata);

  console.log(
    "\n\ncreatepersonOrg validated: " + JSON.stringify(validatedData)
  );

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
    personId: parsedData.personId,
    orgId: parsedData.orgId,
    title: parsedData.title,
    subOrg: parsedData.subOrg,
    email: parsedData.email,
    phone: parsedData.phone,
    address: address,
    description: parsedData.description,
  };

  console.log("\n\nperson org to create data: " + JSON.stringify(data));

  const rval = await prisma.personsOrgs.create({
    data: data,
  });

  return rval;
}

export async function destroyPersonOrg(id: string) {
  await prisma.personsOrgs.delete({
    where: {
      id: id,
    },
  });
  return;
}
