import { prisma } from "~/db/db.server";

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
    orderBy: z.string().transform((val) => {
      // console.log("\n\n validatecreate orderby : " + val);
      const p = Number(val);
      return p;
    }),
  });

  const parsedData = schema.safeParse(formData);

  // console.log("\n\nopp status validateEdit data?: " + JSON.stringify(parseddata,null, 2));

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
      //console.log("\n\n validatecreate orderby : " + val);
      const p = Number(val);
      return p;
    }),
  });

  const parsedData = schema.safeParse(formData);

  // console.log("\n\opp status validateCreate data?: " + JSON.stringify(parseddata, null, 2));

  return parsedData;
}

export async function getAllOppStatuses() {
  const rval = await prisma.opportunityStatuses.findMany({
    orderBy: [{ orderBy: "asc" }, { id: "asc" }],
  });
  return rval;
}

export async function getAllActiveOppStatuses() {
  const rval = await prisma.opportunityStatuses.findMany({
    where: { isActive: true },
    orderBy: [{ orderBy: "asc" }, { id: "asc" }],
  });
  return rval;
}

export async function getOppStatusById(oid: string) {
  const rval = await prisma.opportunityStatuses.findUnique({
    where: { id: oid },
    include: { opportunities: true },
  });

  return rval;
}

export async function updateOppStatus(formData) {
  // console.log("\n\n updateOppStatus formdata: " + JSON.stringify(formData , null, 2));

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

  const rval = await prisma.opportunityStatuses.update({
    where: { id: oid },
    data: data,
  });

  return rval;
}

export async function updateOppStatusesReOrder(inData: OrderByType[]) {
  // console.log("\n\n updateOppStatusesReOrder formdata: " + JSON.stringify(formdata));

  try {
    let j = 0;
    for (j; j < inData.length; j++) {
      const row = inData[j];

      const data = {
        id: row.id,
        orderBy: row.new,
      };

      //  console.log(
      //   "\n\n updateOppStatusesReOrder data: " + JSON.stringify(data)
      // );

      const rval = await prisma.opportunityStatuses.update({
        where: { id: data.id },
        data: data,
      });
    }

    return true;
  } catch (e) {
    //
    console.log(
      "\n\n updateOppStatusesReOrder update error: " +
        JSON.stringify(e, null, 2)
    );
    return false;
  }
}

export async function createOppStatus(formData) {
  const validatedData = validateCreate(formData);

  // console.log("\n\n createOppStatus: " + JSON.stringify(parsedData,null, 2));

  if (validatedData.success == false) {
    //  console.log("\n\nreturning to previous");
    return { error: validatedData.error.format() };
  }

  const parsedData = validatedData.data;

  const data = {
    id: parsedData.id,
    isActive: parsedData.isActive,
  };

  const orgType = await prisma.opportunityStatuses.create({
    data: data,
  });

  return orgType;
}

export async function destroyOppStatuses(oid) {
  await prisma.opportunityStatuses.delete({
    where: {
      id: oid,
    },
  });

  return;
}
