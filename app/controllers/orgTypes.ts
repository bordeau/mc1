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

export async function getAllOrgTypes() {
  const orgTypes = await prisma.orgTypes.findMany({
    orderBy: [{ orderBy: "asc" }, { id: "asc" }],
  });
  return orgTypes;
}

export async function getAllActiveOrgTypes() {
  const rval = await prisma.orgTypes.findMany({
    where: { isActive: true },
    orderBy: [{ orderBy: "asc" }, { id: "asc" }],
  });
  return rval;
}

export async function getOrgTypeById(oid: string) {
  const rval = await prisma.orgTypes.findUnique({
    where: { id: oid },
    include: { orgs: true },
  });

  return rval;
}

export async function updateOrgType(formData) {
  // console.log("\n\n updateroles formdata: " + JSON.stringify(formdata));

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

  const rval = await prisma.orgTypes.update({
    where: { id: oid },
    data: data,
  });

  return rval;
}

export async function updateOrgTypesReOrder(inData: OrderByType[]) {
  // console.log("\n\n updateOrgTypesReOrder formdata: " + JSON.stringify(formdata));

  try {
    let j = 0;
    for (j; j < inData.length; j++) {
      const row = inData[j];

      const data = {
        id: row.id,
        orderBy: row.new,
      };

      //   console.log("\n\n updateOrgTypesReOrder data: " + JSON.stringify(data));

      const rval = await prisma.orgTypes.update({
        where: { id: data.id },
        data: data,
      });
    }

    return true;
  } catch (e) {
    //
    console.log(
      "\n\n updateOrgTypesReOrder update error: " + JSON.stringify(e, null, 2)
    );
    return false;
  }
}

export async function createOrgType(formData) {
  const validatedData = validateCreate(formData);

  // console.log("\n\n updateroles: " + JSON.stringify(parsedData));

  if (validatedData.success == false) {
    //  console.log("\n\nreturning to previous");
    return { error: validatedData.error.format() };
  }

  const parsedData = validatedData.data;

  const data = {
    id: parsedData.id,
    isActive: parsedData.isActive,
  };

  const orgType = await prisma.orgTypes.create({
    data: data,
  });

  return orgType;
}

export async function destroyOrgType(oid) {
  await prisma.orgTypes.delete({
    where: {
      id: oid,
    },
  });

  return;
}
