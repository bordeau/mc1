import { prisma } from "~/db/db.server";
import { z } from "zod";
import { Roles } from "~/models/role";
import bcrypt from "bcryptjs";

export async function getAllRegistrations() {
  const registrations = await prisma.registrations.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
  return registrations;
}

export async function getLikeNameRegistrations(sp) {
  const registrations = await prisma.registrations.findMany({
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
  return registrations;
}

export async function getRegistrationById(i: string) {
  const registration = await prisma.registrations.findUniqueOrThrow({
    where: { id: i },
  });

  return registration;
}

function validateEdit(formData) {
  const schema = z.object({
    id: z.string(),
    username: z.string(),
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    email: z.string().email().min(5, { message: "Email is required" }),
    phone: z.string().nullable(),
    addressType: z.string().nullable(),
    street1: z.string().nullable(),
    street2: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    zip: z.string().nullable(),
    country: z.string().nullable(),
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
  });

  const parsedData = optionalAddress.safeParse(formData);

  console.log("\n\nperson verified data?: " + JSON.stringify(parsedData));

  return parsedData;
}

function validateCreate(formData) {
  const schema = z.object({
    username: z.string(),
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    email: z.string().email().min(5, { message: "Email is required" }),
    phone: z.string().nullable(),
    addressType: z.string().nullable(),
    street1: z.string().nullable(),
    street2: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    zip: z.string().nullable(),
    country: z.string().nullable(),
  });

  const optionalAddress = schema.partial({
    addressType: true,
    role: true,
    phone: true,
    street1: true,
    street2: true,
    city: true,
    state: true,
    zip: true,
    country: true,
  });

  const validatedData = optionalAddress.safeParse(formData);

  // console.log("\n\nperson verified data?: " + JSON.stringify(parsedData, null, 2));

  return validatedData;
}

export async function setIsProcessRegistration(
  id: string,
  isProcessed: boolean
) {
  const data = { isProcessed: isProcessed };

  const rval = await prisma.registrations.update({
    where: { id: id },
    data: data,
  });

  return rval;
}
export async function updateRegistration(formData) {
  const validatedData = validateEdit(formData);

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
    username: parsedData.username,
    firstName: parsedData.firstName,
    lastName: parsedData.lastName,
    email: parsedData.email,
    phone: parsedData.phone,
    address: address,
  };

  // const pid: number = Number(parsedData.id);

  console.log("\n\nperson to update data: " + JSON.stringify(data));

  const id = parsedData.id;

  const rval = await prisma.registrations.update({
    where: { id: id },
    data: data,
  });

  return rval;
}

export async function createRegistration(formData) {
  const validatedResult = validateCreate(formData);

  if (!validatedResult.success) {
    return { error: validatedResult.error.format() };
  }

  const parsedData = validatedResult.data;

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
    username: parsedData.username,
    firstName: parsedData.firstName,
    lastName: parsedData.lastName,
    email: parsedData.email,
    phone: parsedData.phone,
    address: address,
  };

  console.log("\n\nuser create data: " + JSON.stringify(data));

  const rval = await prisma.registrations.create({
    data: data,
  });

  return rval;
}

export async function destroyRegistration(pid: string) {
  await prisma.registrations.delete({
    where: {
      id: pid,
    },
  });

  return;
}
