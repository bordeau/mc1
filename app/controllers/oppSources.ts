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
      console.log("\n\n validatecreate orderby : " + val);
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
      console.log("\n\n validatecreate orderby : " + val);
      const p = Number(val);
      return p;
    }),
  });

  const parsedData = schema.safeParse(formData);

  // console.log("\n\nrole verified data?: " + JSON.stringify(parseddata));

  return parsedData;
}

export async function getAllOppSources() {
  const rval = await prisma.opportunitySources.findMany({
    orderBy: [{ orderBy: "asc" }, { id: "asc" }],
  });
  return rval;
}

export async function getAllActiveOppSources() {
  const rval = await prisma.opportunitySources.findMany({
    where: { isActive: true },
    orderBy: [{ orderBy: "asc" }, { id: "asc" }],
  });
  return rval;
}

export async function getOppSourceById(oid: string) {
  const rval = await prisma.opportunitySources.findUnique({
    where: { id: oid },
    include: { opporunities: true },
  });

  return rval;
}

export async function updateOppSource(formData) {
  // console.log("\n\n updateOppType formdata: " + JSON.stringify(formdata));

  const validatedEdit = validateEdit(formData);

  // console.log("\n\n updateOppSource: " + JSON.stringify(parsedData,null,2));

  if (validatedEdit.success == false) {
    //   console.log("\n\nreturning to previous");
    return { error: validatedEdit.error.format() };
  }

  const parsedData = validatedEdit.data;
  const oid = parsedData.currentId;
  const data = {
    id: parsedData.id,
    isActive: parsedData.isActive,
    orderBy: parsedData.orderBy,
  };

  const rval = await prisma.opportunitySources.update({
    where: { id: oid },
    data: data,
  });

  return rval;
}

export async function updateOppSourcesReOrder(inData: OrderByType[]) {
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

      const rval = await prisma.opportunitySources.update({
        where: { id: data.id },
        data: data,
      });
    }

    return true;
  } catch (e) {
    //
    console.log(
      "\n\n updateOppSourcesReOrder update error: " + JSON.stringify(e, null, 2)
    );
    return false;
  }
}

export async function createOppSource(formData) {
  const validatedData = validateCreate(formData);

  console.log(
    "\n\n createOppSource: " + JSON.stringify(validatedData, null, 2)
  );

  if (validatedData.success == false) {
    //  console.log("\n\nreturning to previous");
    return { error: validatedData.error.format() };
  }

  const parsedData = validatedData.data;

  const data = {
    id: parsedData.id,
    isActive: parsedData.isActive,
    orderBy: parsedData.orderBy,
  };

  const orgType = await prisma.opportunitySources.create({
    data: data,
  });

  return orgType;
}

export async function destroyOppSource(oid) {
  await prisma.opportunitySources.delete({
    where: {
      id: oid,
    },
  });

  return;
}
