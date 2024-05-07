import { prisma } from "~/db/db.server";

import { z } from "zod";
import { OrderByType } from "~/models/misc";
import { redirect } from "@remix-run/node";
function validateEdit(formData) {
  const schema = z.object({
    id: z.string(),
    currentId: z.string(),
    isActive: z.string().transform((val) => {
      const p = !!val; // val ? true : false;
      return p;
    }),
    orderBy: z.string().transform((val) => {
      // console.log("\n\n validatecreate orderby : " + val);
      const p = Number(val);
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
    orderBy: z.string().transform((val) => {
      // console.log("\n\n validatecreate orderby : " + val);
      const p = Number(val);
      return p;
    }),
  });

  const parsedData = schema.safeParse(formData);

  // console.log("\n\nrole verified data?: " + JSON.stringify(parseddata));

  return parsedData;
}

export async function getAllOppTypes() {
  const oppoTypes = await prisma.opportunityTypes.findMany({
    orderBy: [{ orderBy: "asc" }, { id: "asc" }],
  });
  return oppoTypes;
}

export async function getAllActiveOppTypes() {
  const rval = await prisma.opportunityTypes.findMany({
    where: { isActive: true },
    orderBy: [{ orderBy: "asc" }, { id: "asc" }],
  });
  return rval;
}

export async function getOppTypeById(oid: string) {
  const rval = await prisma.opportunityTypes.findUnique({
    where: { id: oid },
    include: { opportunities: true },
  });

  return rval;
}

export async function updateOppType(formData) {
  // console.log("\n\n updateOppType formdata: " + JSON.stringify(formdata));

  const validatedEdit = validateEdit(formData);

  // console.log("\n\n updateOppType: " + JSON.stringify(parsedData));

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

  const rval = await prisma.opportunityTypes.update({
    where: { id: oid },
    data: data,
  });

  return rval;
}

export async function updateOppTypeReOrder(inData: OrderByType[]) {
  // console.log("\n\n updateOppType formdata: " + JSON.stringify(formdata));

  try {
    let j = 0;
    for (j; j < inData.length; j++) {
      const row = inData[j];

      const data = {
        id: row.id,
        orderBy: row.new,
      };

      //   console.log("\n\n updateOppTypeReOrder data: " + JSON.stringify(data));

      const rval = await prisma.opportunityTypes.update({
        where: { id: data.id },
        data: data,
      });
    }

    return true;
  } catch (e) {
    //
    console.log(
      "\n\n updateOppTypeReOrder update error: " + JSON.stringify(e, null, 2)
    );
    return false;
  }
}

export async function createOppType(formData) {
  const validatedData = validateCreate(formData);

  // console.log("\n\n createOppType: " + JSON.stringify(parsedData));

  if (validatedData.success == false) {
    //  console.log("\n\nreturning to previous");
    return { error: validatedData.error.format() };
  }

  const parsedData = validatedData.data;

  const data = {
    id: parsedData.id,
    isActive: parsedData.isActive,
  };

  const orgType = await prisma.opportunityTypes.create({
    data: data,
  });

  return orgType;
}

export async function destroyOppType(oid) {
  await prisma.opportunityTypes.delete({
    where: {
      id: oid,
    },
  });

  return;
}
