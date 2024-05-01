import { prisma } from "~/db/db.server";
import { z } from "zod";
import { Roles } from "~/models/role";
import bcrypt from "bcryptjs";

export async function getAllUsers() {
  const users = await prisma.users.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
  return users;
}

export async function getAllAdminUsers() {
  const users = await prisma.users.findMany({
    where: { role: "Admin" },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
  return users;
}

export async function getLikeNameUsers(sp) {
  const users = await prisma.users.findMany({
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
  return users;
}

export async function getUserById(i: string) {
  const rval = await prisma.users.findUniqueOrThrow({
    where: { id: i },
  });

  return rval;
}

export async function getUserByUsername(nm: string) {
  const rval = await prisma.users.findUniqueOrThrow({
    where: { username: nm },
  });

  return rval;
}

function validateEdit(formData) {
  const schema = z.object({
    id: z.string(),
    username: z.string(),
    password: z.string(),
    role: z.string(),
    isActive: z.boolean(),
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
    password: z.string(),
    role: z.string(),
    isActive: z.boolean(),
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

export async function updateUserPassword(id: string, newPassword: string) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const data = {
    password: hashedPassword,
  };

  const rval = await prisma.users.update({
    where: { id: id },
    data: data,
  });

  return rval;
}

export async function updateUser(formData) {
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

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(parsedData.password, salt);

  const data = {
    username: parsedData.username,
    firstName: parsedData.firstName,
    lastName: parsedData.lastName,
    email: parsedData.email,
    phone: parsedData.phone,
    address: address,
    isActive: parsedData.isActive,
    role: Roles.isRoleValid(parsedData.role),
  };

  // const pid: number = Number(parsedData.id);

  console.log("\n\nperson to update data: " + JSON.stringify(data));

  const id = parsedData.id;

  const rval = await prisma.users.update({
    where: { id: id },
    data: data,
  });

  return rval;
}

export async function createUser(formData) {
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

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(parsedData.password, salt);

  const data = {
    username: parsedData.username,
    password: hashedPassword,
    firstName: parsedData.firstName,
    lastName: parsedData.lastName,
    email: parsedData.email,
    phone: parsedData.phone,
    address: address,
    isActive: parsedData.isActive,
    role: Roles.isRoleValid(parsedData.role),
  };

  console.log("\n\nuser create data: " + JSON.stringify(data));

  const rval = await prisma.users.create({
    data: data,
  });

  return rval;
}

export async function destroyUser(pid: string) {
  await prisma.users.delete({
    where: {
      id: pid,
    },
  });

  return;
}
