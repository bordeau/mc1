import { prisma } from "~/db/db.server.ts";
import { z } from "zod";
import { json } from "@remix-run/node";
import { Person } from "~/models/types";

export async function getAllPersons() {
  const persons = await prisma.persons.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
  return persons;
}

export async function getAllActivePersons() {
  const persons = await prisma.persons.findMany({
    where: { isActive: true },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
  return persons;
}

export async function getAllPersonsByOwner(oid) {
  const persons = await prisma.persons.findMany({
    where: { ownerId: oid },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
  return persons;
}

export async function getActivePersonsByOwner(oid) {
  const persons = await prisma.persons.findMany({
    where: { ownerId: oid, isActive: true },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
  return persons;
}

export async function getLikeNamePersons(sp) {
  const persons = await prisma.persons.findMany({
    where: {
      OR: [
        {
          firstName: {
            contains: sp,
          },
        },
        {
          lastName: {
            contains: sp,
          },
        },
      ],
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
  return persons;
}

export async function getPersonById(i: number) {
  const rval = await prisma.persons.findUnique({
    where: { id: i },
    include: {
      owner: true,
      personOrgs: {
        include: { org: true },
      },
    },
  });

  return rval;
}
function validateEdit(formData) {
  const schema = z.object({
    id: z.string(),
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    ownerId: z.string(),
    email: z.string().email().min(5, { message: "Email is required" }),
    isActive: z.string().transform((val) => {
      const p = !!val; // val ? true : false;
      return p;
    }),
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

  const optionalAddress = schema.partial({
    addressType: true,
    phone: true,
    street1: true,
    street2: true,
    city: true,
    state: true,
    zip: true,
    country: true,
    description: true,
  });

  const parsedData = optionalAddress.safeParse(formData);

  console.log("\n\nperson verified data?: " + JSON.stringify(parsedData));

  return parsedData;
}

function validateCreate(formData) {
  const schema = z.object({
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    ownerId: z.string(),
    email: z.string().email().min(5, { message: "Email is required" }),
    isActive: z.string().transform((val) => {
      const p = !!val; // val ? true : false;
      return p;
    }),
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

  const optionalAddress = schema.partial({
    addressType: true,
    phone: true,
    street1: true,
    street2: true,
    city: true,
    state: true,
    zip: true,
    country: true,
    description: true,
  });

  const parsedData = optionalAddress.safeParse(formData);

  // console.log("\n\nperson verified data?: " + JSON.stringify(parsedData, null, 2));

  return parsedData;
}

export async function updatePerson(formData): Promise<Person> {
  const validatedData = validateEdit(formData);

  /*
  console.log(
    "\n\nupdate person: " +
      JSON.stringify(validatedData, null, 2)
  );

   */

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
    firstName: parsedData.firstName,
    lastName: parsedData.lastName,
    ownerId: parsedData.ownerId,
    email: parsedData.email,
    isActive: parsedData.isActive,
    phone: parsedData.phone,
    address: address,
    description: parsedData.description,
  };

  // const pid: number = Number(parsedData.id);

  console.log("\n\nperson to update data: " + JSON.stringify(data));

  const id = parsedData.id;

  const rval = await prisma.persons.update({
    where: { id: id },
    data: data,
  });

  return rval;
}

export async function createPerson(formData): Promise<Person> {
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
    firstName: parsedData.firstName,
    lastName: parsedData.lastName,
    ownerId: parsedData.ownerId,
    email: parsedData.email,
    isActive: parsedData.isActive,
    phone: parsedData.phone,
    address: address,
    description: parsedData.description,
  };

  console.log("\n\nperson to create data: " + JSON.stringify(data));

  const rval = await prisma.persons.create({
    data: data,
  });

  return rval;
}

export async function destroyPerson(pid: number) {
  await prisma.persons.delete({
    where: {
      id: pid,
    },
  });

  return;
}
