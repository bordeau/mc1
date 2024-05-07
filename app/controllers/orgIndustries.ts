import { prisma } from "~/db/db.server.ts";

import { z } from "zod";
import { OrderByType } from "~/models/misc";
function validateEdit(formData) {
  const schema = z.object({
    id: z.string(),
    currentId: z.string(),
    isActive: z.string().transform((val) => {
      const p = !!val; // val ? true : false;
      return p;
    }),
  });

  const parsedData = schema.safeParse(formData);

  // console.log("\n\nrole verified data?: " + JSON.stringify(parseddata));

  return parsedData;
}
function validateCreate(formData) {
  const schema = z.object({
    id: z.string(),
    isActive: z.string().transform((val) => {
      const p = !!val; // val ? true : false;
      return p;
    }),
  });

  const parsedData = schema.safeParse(formData);

  // console.log("\n\nrole verified data?: " + JSON.stringify(parseddata));

  return parsedData;
}

export async function getAllOrgIndustries() {
  const rval = await prisma.orgIndustries.findMany({
    orderBy: [{ orderBy: "asc" }, { id: "asc" }],
  });
  return rval;
}

export async function getAllActiveOrgIndustries() {
  const rval = await prisma.orgIndustries.findMany({
    where: { isActive: true },
    orderBy: [{ orderBy: "asc" }, { id: "asc" }],
  });
  return rval;
}

export async function getOrgIndustryById(oid: string) {
  const rval = await prisma.orgIndustries.findUnique({
    where: { id: oid },
    include: { orgs: true },
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
    isActive: parsedData.isActive,
  };

  const rval = await prisma.orgIndustries.update({
    where: { id: oid },
    data: data,
  });

  return rval;
}

export async function updateOrgIndustriesReOrder(inData: OrderByType[]) {
  // console.log("\n\n updateOrgIndustriesOrder formdata: " + JSON.stringify(formdata));

  try {
    let j = 0;
    for (j; j < inData.length; j++) {
      const row = inData[j];

      const data = {
        id: row.id,
        orderBy: row.new,
      };

      //   console.log("\n\n updateOrgIndustriesOrder data: " + JSON.stringify(data));

      const rval = await prisma.orgIndustries.update({
        where: { id: data.id },
        data: data,
      });
    }

    return true;
  } catch (e) {
    //
    console.log(
      "\n\n updateOrgIndustriesOrder update error: " +
        JSON.stringify(e, null, 2)
    );
    return false;
  }
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
    isActive: parsedData.isActive,
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
