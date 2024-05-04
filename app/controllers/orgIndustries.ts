import { prisma } from "~/db/db.server.ts";

import { z } from "zod";
function validateEdit(formData) {
  const schema = z.object({
    id: z.string(),
    currentId: z.string(),
  });

  const parsedData = schema.safeParse(formData);

  // console.log("\n\nrole verified data?: " + JSON.stringify(parseddata));

  return parsedData;
}
function validateCreate(formData) {
  const schema = z.object({
    id: z.string(),
  });

  const parsedData = schema.safeParse(formData);

  // console.log("\n\nrole verified data?: " + JSON.stringify(parseddata));

  return parsedData;
}

export async function getAllOrgIndustries() {
  const rval = await prisma.orgIndustries.findMany({
    orderBy: [{ id: "asc" }],
  });
  return rval;
}

export async function getOrgIndustryById(oid: string) {
  const rval = await prisma.orgIndustries.findUnique({
    where: { id: oid },
  });

  return rval;
}

export async function updateOrgIndustry(formData) {
  // console.log("\n\n updateOrgIndustry formdata: " + JSON.stringify(formdata));

  const validatedEdit = validateEdit(formData);

  // console.log("\n\n updateroles: " + JSON.stringify(parsedData));

  if (validatedEdit.success == false) {
    //   console.log("\n\nreturning to previous");
    return { error: validatedEdit.error.format() };
  }

  const parsedData = validatedEdit.data;
  const oid = parsedData.currentId;
  const data = {
    id: parsedData.id,
  };

  const rval = await prisma.orgIndustries.update({
    where: { id: oid },
    data: data,
  });

  return rval;
}

export async function createOrgIndustry(formData) {
  const validatedData = validateCreate(formData);

  // console.log("\n\n createOrgIndustry: " + JSON.stringify(parsedData));

  if (validatedData.success == false) {
    //  console.log("\n\nreturning to previous");
    return { error: validatedData.error.format() };
  }

  const parsedData = validatedData.data;

  const data = {
    id: parsedData.id,
  };

  const orgType = await prisma.orgIndustries.create({
    data: data,
  });

  return orgType;
}

export async function destroyOrgIndustry(oid) {
  await prisma.orgIndustries.delete({
    where: {
      id: oid,
    },
  });

  return;
}
