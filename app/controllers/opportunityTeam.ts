import { prisma } from "~/db/db.server.ts";
import { z } from "zod";
import { json } from "@remix-run/node";

export async function getOppTeamByOppId(oid: string) {
  const rval = await prisma.opportunityTeam.findMany({
    where: { opportunityId: oid },
    include: {
      person: true,
      user: true,
    },
  });

  return rval;
}

export async function getOppTeamById(id: string) {
  const rval = await prisma.opportunityTeam.findUnique({
    where: {
      id: id,
    },
    include: {
      opportunity: true,
      person: true,
      user: true,
    },
  });

  return rval;
}

function validateEdit(formData) {
  const schema = z.object({
    id: z.string(),
    opportunityId: z.string(),
    role: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
    personOrgId: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
    userId: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
  });

  const optional = schema.partial({
    role: true,
    personOrgId: true,
    userId: true,
  });

  const parseddata = optional.safeParse(formData);

  // console.log("\n\nperson verified data?: " + JSON.stringify(parseddata));

  return parseddata;
}

function validateCreate(formData) {
  const schema = z.object({
    opportunityId: z.string(),
    role: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
    personOrgId: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
    userId: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
  });

  const optional = schema.partial({
    role: true,
    personOrgId: true,
    userId: true,
  });

  const parseddata = optional.safeParse(formData);

  // console.log("\n\nperson verified data?: " + JSON.stringify(parseddata));

  return parseddata;
}

export async function updateOppTeam(formdata) {
  const validatedData = validateEdit(formdata);

  /*
  console.log(
    "\n\nupdateOppTeam: " +
      JSON.stringify(validatedData, null, 2) +
      " success:" +
      validatedData.success
  );

   */

  if (validatedData.success == false) {
    // console.log("\n\nreturning to previous");
    return { error: validatedData.error.format() };
  }

  // console.log("\n\n\n should only be here if parsedata.sucess is true");
  const parsedData = validatedData.data;

  const data = {
    personOrgId: parsedData.personOrgId,
    userId: parsedData.userId,
    role: parsedData.role,
    opportunityId: parsedData.opportunityId,
  };

  const id = parsedData.id;

  // console.log(
  //  "\n\nupdateOppTeam to update data: " + JSON.stringify(data, null, 2)
  // );

  const rval = await prisma.opportunityTeam.update({
    where: {
      id: id,
    },
    data: data,
  });

  return rval;
}

export async function createOppTeam(formdata) {
  // console.log("\n\createOppTeam formdata: " + JSON.stringify(formdata, null, 2));

  const validatedData = validateCreate(formdata);

  // console.log(
  //   "\n\ncreateOppTeam validated: " + JSON.stringify(validatedData)
  // );

  if (!validatedData.success) {
    return { error: validatedData.error.format() };
  }

  const parsedData = validatedData.data;

  const data = {
    personOrgId: parsedData.personOrgId,
    userId: parsedData.userId,
    role: parsedData.role,
    opportunityId: parsedData.opportunityId,
  };

  // console.log("\n\ncreateOppTeam to create data: " + JSON.stringify(data));

  const rval = await prisma.opportunityTeam.create({
    data: data,
  });

  return rval;
}

export async function destroyOppTeam(id: string) {
  await prisma.opportunityTeam.delete({
    where: {
      id: id,
    },
  });
  return;
}
