import { prisma } from "~/db/db.server";
import { undefined, z } from "zod";
import { json } from "@remix-run/node";
import All = Property.All;
import { getOppStatusById } from "~/controllers/oppStatuses";

export async function getAllOpps() {
  const list = await prisma.opportunities.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
  });
  return list;
}

export async function getAllActiveOpps() {
  const list = await prisma.opportunities.findMany({
    where: { isActive: true },
    orderBy: [{ type: "asc" }, { name: "asc" }],
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
  });
  return list;
}

export async function getAllLeadOpps() {
  const list = await prisma.opportunities.findMany({
    where: { type: "L" },
    orderBy: [{ name: "asc" }],
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
  });
  return list;
}

export async function getAllActiveLeadOpps() {
  const list = await prisma.opportunities.findMany({
    where: { type: "L", isActive: true },
    orderBy: [{ name: "asc" }],
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
  });
  return list;
}

export async function getAllOOpps() {
  const list = await prisma.opportunities.findMany({
    where: { type: "O" },
    orderBy: [{ name: "asc" }],
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
  });
  return list;
}

export async function getAllActiveOOpps() {
  const list = await prisma.opportunities.findMany({
    where: { type: "O", isActive: true },
    orderBy: [{ name: "asc" }],
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
  });
  return list;
}

export async function getOppsByOwner(oid) {
  const list = await prisma.opportunities.findMany({
    where: { ownerId: oid },
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
  return list;
}

export async function getActiveOppsByOwner(oid) {
  const list = await prisma.opportunities.findMany({
    where: { ownerId: oid, isActive: true, type: "O" },
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
    orderBy: [{ name: "asc" }],
  });
  return list;
}

export async function getActiveLeadsByOwner(oid) {
  const list = await prisma.opportunities.findMany({
    where: { ownerId: oid, isActive: true, type: "L" },
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
    orderBy: [{ name: "asc" }],
  });
  return list;
}

export async function getLikeNameOpps(sp) {
  const list = await prisma.opportunities.findMany({
    where: {
      name: {
        contains: sp,
      },
    },
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
  return list;
}

export async function getLikeNameActiveOpps(sp) {
  const list = await prisma.opportunities.findMany({
    where: {
      isActive: true,
      name: {
        contains: sp,
      },
    },
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
  return list;
}

export async function getLikeNameLeadOpps(sp) {
  const list = await prisma.opportunities.findMany({
    where: {
      type: "L",
      name: {
        contains: sp,
      },
    },
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
    orderBy: [{ name: "asc" }],
  });
  return list;
}

export async function getLikeNameActiveLeadOpps(sp) {
  const list = await prisma.opportunities.findMany({
    where: {
      type: "L",
      isActive: true,
      name: {
        contains: sp,
      },
    },
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
    orderBy: [{ name: "asc" }],
  });
  return list;
}

export async function getLikeNameOOpps(sp) {
  const list = await prisma.opportunities.findMany({
    where: {
      type: "O",
      name: {
        contains: sp,
      },
    },
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
    orderBy: [{ name: "asc" }],
  });
  return list;
}

export async function getLikeNameActiveOOpps(sp) {
  const list = await prisma.opportunities.findMany({
    where: {
      type: "O",
      isActive: true,
      name: {
        contains: sp,
      },
    },
    include: {
      orgs: true,
      persons: true,
      owner: true,
    },
    orderBy: [{ name: "asc" }],
  });
  return list;
}

export async function getOppById(i: string) {
  const rval = await prisma.opportunities.findUnique({
    where: { id: i },
    include: {
      orgs: true,
      persons: true,
      owner: true,
      opportunityTeam: { include: { user: true, person: true } },
      opportunityHistory: {
        include: { user: true },
      },
    },
  });

  return rval;
}

type Diffs = {
  name: string;
  orig: never;
  new: never;
};

type AllDiffs = {
  data: Diffs[];
};

async function saveDiffs(pd, cu) {
  const item = await getOppById(pd.id);
  // console.log("\n\n save diff item: " + JSON.stringify(item, null, 2));
  // console.log("\n\n save diff pd: " + JSON.stringify(pd, null, 2));

  const diffs: AllDiffs = { data: [] } as AllDiffs;
  const data: Diffs[] = [];
  let rrval = undefined;
  //
  // try {
  if (pd.name !== item.name) {
    const n = { name: "name", orig: item.name, new: pd.name } as Diffs;
    data.push(n);
  }
  //
  if (pd.ownerId !== item.ownerId) {
    //
    const n = {
      name: "ownerId",
      orig: item.ownerId,
      new: pd.ownerId,
    } as Diffs;
    data.push(n);
  }
  //

  // console.log("\n\n in org test: " + pd.hasOwnProperty("orgId"));
  // console.log("\n\n in org test orgId: " + pd.orgId);
  if (
    (item.orgId && pd.hasOwnProperty("orgId") && pd.orgId !== item.orgId) ||
    (!item.orgId && pd.hasOwnProperty("orgId") && pd.orgId !== null)
  ) {
    //
    const orgId = !pd.hasOwnProperty("orgId") ? null : pd.orgId;
    const n = { name: "orgId", orig: item.orgId, new: orgId } as Diffs;
    data.push(n);
  }
  //
  if (
    (item.personId &&
      pd.hasOwnProperty("personId") &&
      pd.personId !== item.personId) ||
    (!item.personId && pd.hasOwnProperty("personId") && pd.personId !== null)
  ) {
    //
    const personId = !pd.hasOwnProperty("personId") ? null : pd.personId;
    const n = {
      name: "personId",
      orig: item.personId,
      new: personId,
    } as Diffs;
    data.push(n);
  }
  //
  if (
    (item.statusChangeDate &&
      pd.hasOwnProperty("statusChangeDate") &&
      pd.statusChangeDate.toDateString() !==
        item.statusChangeDate.toDateString()) ||
    (!item.statusChangeDate &&
      pd.hasOwnProperty("statusChangeDate") &&
      pd.statusChangeDate !== null)
  ) {
    const n = {
      name: "statusChangeDate",
      orig: item.statusChangeDate,
      new: pd.statusChangeDate,
    } as Diffs;
    data.push(n);
  }
  //
  if (
    (item.actualClosedDate &&
      pd.hasOwnProperty("actualClosedDate") &&
      pd.actualClosedDate.toDateString() !==
        item.actualClosedDate.toDateString()) ||
    (!item.actualClosedDate &&
      pd.hasOwnProperty("actualClosedDate") &&
      pd.actualClosedDate !== null)
  ) {
    const n = {
      name: "closeDate",
      orig: item.actualClosedDate,
      new: pd.actualClosedDate,
    } as Diffs;
    data.push(n);
  }
  //
  if (
    (item.expectedOutcome &&
      pd.hasOwnProperty("expectedOutcome") &&
      pd.expectedOutcome !== item.expectedOutcome) ||
    (!item.expectedOutcome &&
      pd.hasOwnProperty("expectedOutcome") &&
      pd.expectedOutcome !== null)
  ) {
    const n = {
      name: "expectedOutcome",
      orig: item.expectedOutcome,
      new: pd.expectedOutcome,
    } as Diffs;
    data.push(n);
  }
  //
  if (
    (item.closedOutcome &&
      pd.hasOwnProperty("closedOutcome") &&
      pd.closedOutcome !== item.closedOutcome) ||
    (!item.closedOutcome &&
      pd.hasOwnProperty("closedOutcome") &&
      pd.closedOutcome !== null)
  ) {
    const n = {
      name: "closedOutcome",
      orig: item.closedOutcome,
      new: pd.closedOutcome,
    } as Diffs;
    data.push(n);
  }
  //
  if (
    (item.activityDiscussion &&
      pd.hasOwnProperty("activityDiscussion") &&
      pd.activityDiscussion !== item.activityDiscussion) ||
    (!item.closedOutcome &&
      pd.hasOwnProperty("activityDiscussion") &&
      pd.activityDiscussion !== null)
  ) {
    const n = {
      name: "activityDiscussion",
      orig: item.activityDiscussion,
      new: pd.activityDiscussion,
    } as Diffs;
    data.push(n);
  }
  //
  if (
    (item.opportunityType &&
      pd.hasOwnProperty("opportunityType") &&
      pd.opportunityType !== item.opportunityType) ||
    (!item.opportunityType &&
      pd.hasOwnProperty("opportunityType") &&
      pd.opportunityType !== null)
  ) {
    const n = {
      name: "opportunityType",
      orig: item.opportunityType,
      new: pd.opportunityType,
    } as Diffs;
    data.push(n);
  }
  //
  if (
    (item.opportunitySource &&
      pd.hasOwnProperty("opportunitySource") &&
      pd.opportunitySource !== item.opportunitySource) ||
    (!item.opportunitySource &&
      pd.hasOwnProperty("opportunityType") &&
      pd.opportunityType !== null)
  ) {
    const n = {
      name: "opportunitySource",
      orig: item.opportunitySource,
      new: pd.opportunitySource,
    } as Diffs;
    data.push(n);
  }
  //
  if (
    (item.opportunityStatus &&
      pd.hasOwnProperty("opportunityStatus") &&
      pd.opportunityStatus !== item.opportunityStatus) ||
    (!item.opportunityStatus &&
      pd.hasOwnProperty("opportunityStatus") &&
      pd.opportunityStatus !== null)
  ) {
    const n = {
      name: "opportunityStatus",
      orig: item.opportunityStatus,
      new: pd.opportunityStatus,
    } as Diffs;
    data.push(n);
  }
  if (pd.isActive !== item.isActive) {
    const n = { name: "isActive", orig: item.isActive, new: pd.isActive };
    data.push(n);
  }
  //
  if (
    (item.description &&
      pd.hasOwnProperty("description") &&
      pd.description !== item.description) ||
    (!item.description &&
      pd.hasOwnProperty("description") &&
      pd.description !== null)
  ) {
    const n = {
      name: "description",
      orig: item.description,
      new: pd.description,
    } as Diffs;
    data.push(n);
  }
  if (pd.type !== item.type) {
    const n = {
      name: "type",
      orig: item.type,
      new: pd.type,
    } as Diffs;
    data.push(n);
  }
  diffs.data = data;

  // console.log("\n\n saveData diffs: " + JSON.stringify(diffs, null, 2));

  const saveData = {
    oppId: item.id,
    userId: cu,
    data: JSON.stringify(diffs.data, null, 2),
  };

  // console.log("\n\n saveData: " + JSON.stringify(saveData, null, 2));

  if (diffs.data.length > 0)
    rrval = await prisma.opportunityHistory.create({
      data: saveData,
    });
  //
  //} catch (e) {
  //

  // console.log("\n\n rrval: " + JSON.stringify(rrval, null, 2));
  //  console.log("\n\n error on saveDiffs:" + JSON.stringify(e));
  // }
}

function validateEdit(formData) {
  const schema = z.object({
    id: z.string(),
    name: z.string().min(3, { message: "Name is required" }),
    ownerId: z.string(),
    orgId: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
    personId: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
    type: z.string().nullable(),
    statusChangeDate: z
      .string()
      .nullable()
      .transform((val) => {
        const p = Date.parse(val); // val ? true : false;
        return p;
      }),
    closeDate: z
      .string()
      .nullable()
      .transform((val) => {
        const p = Date.parse(val); // val ? true : false;
        return p;
      }),
    expectedOutcome: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
    closedOutcome: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
    activityDiscussion: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
    opportunityType: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
    opportunitySource: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
    opportunityStatus: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
    isActive: z.string().transform((val) => {
      const p = !!val; // val ? true : false;
      return p;
    }),

    description: z
      .string()
      .nullable()
      .transform((val) => {
        if (val == "") return null;
        else return val;
      }),
  });

  const optional = schema.partial({
    orgId: true,
    personId: true,
    type: true,
    statusChangeDate: true,
    activityDiscussion: true,
    closeDate: true,
    expectedOutcome: true,
    closedOutcome: true,
    description: true,
    opportunityType: true,
    opportunitySource: true,
    opportunityStatus: true,
  });

  // console.log(
  //  "\n\nopp validedit form data?: " + JSON.stringify(formData, null, 2)
  // );

  const parsedData = optional.safeParse(formData);

  // console.log(
  //  "\n\nopp validedit verified data?: " + JSON.stringify(parsedData, null, 2)
  // );

  return parsedData;
}

function validateCreate(formData) {
  const schema = z.object({
    name: z.string().min(3, { message: "Name is required" }),
    ownerId: z.string(),
    type: z.string().nullable(),
    orgId: z.string().nullable(),
    personId: z.string().nullable(),
    statusChangeDate: z
      .string()
      .nullable()
      .transform((val) => {
        const p = Date.parse(val); // val ? true : false;
        return p;
      }),
    closeDate: z
      .string()
      .nullable()
      .transform((val) => {
        const p = Date.parse(val); // val ? true : false;
        return p;
      }),
    expectedOutcome: z.string().nullable(),
    closedOutcome: z.string().nullable(),
    activityDiscussion: z.string().nullable(),
    opportunityType: z.string().nullable(),
    opportunitySource: z.string().nullable(),
    opportunityStatus: z.string().nullable(),
    isActive: z.string().transform((val) => {
      const p = !!val; // val ? true : false;
      return p;
    }),

    description: z.string().nullable(),
  });

  const optional = schema.partial({
    orgId: true,
    type: true,
    personId: true,
    statusChangeDate: true,
    closeDate: true,
    expectedOutcome: true,
    closedOutcome: true,
    description: true,
    activityDiscussion: true,
    opportunityType: true,
    opportunitySource: true,
    opportunityStatus: true,
  });

  // console.log("\n\nopp form data?: " + JSON.stringify(formData));

  const parsedData = optional.safeParse(formData);

  // console.log("\n\nopp verified data?: " + JSON.stringify(parsedData));

  return parsedData;
}

export async function updateOpp(formData, cu) {
  const validatedData = await validateEdit(formData);

  // console.log("\n\nupdateopp formdata: " + JSON.stringify(formData, null, 2));

  // console.log(
  //  "\n\nupdate opp validdata: " + JSON.stringify(validatedData, null, 2)
  // );

  if (validatedData.success == false) {
    console.log("\n\nreturning to previous");
    return { error: validatedData.error.format() };
  }

  // console.log("\n\n\n should only be here if parsedata.sucess is true");
  const parsedData = validatedData.data;

  if (parsedData.opportunityStatus) {
    const oppst = await getOppStatusById(parsedData.opportunityStatus);
    if (oppst.isClosed) parsedData.isActive = false;
  }

  // console.log("\n\n updateopp parsed: " + JSON.stringify(parsedData, null, 2));

  const data = {
    name: parsedData.name,
    type: parsedData.type,
    ownerId: parsedData.ownerId,
    orgId: parsedData.orgId,
    personId: parsedData.personId,
    statusChangeDate: parsedData.statusChangeDate,
    closeDate: parsedData.closeDate,
    expectedOutcome: parsedData.expectedOutcome,
    closedOutcome: parsedData.closedOutcome,
    description: parsedData.description,
    opportunityType: parsedData.opportunityType,
    opportunitySource: parsedData.opportunitySource,
    opportunityStatus: parsedData.opportunityStatus,
    isActive: parsedData.isActive,
  };

  const oid = parsedData.id;

  // console.log("\n\nupdateopp data: " + JSON.stringify(data, null, 2));

  await saveDiffs(parsedData, cu);

  // console.log("\n\n in updateopp after savediff");

  const rval = await prisma.opportunities.update({
    where: { id: oid },
    data: data,
  });

  // console.log("\n\nupdateopp rval: " + JSON.stringify(rval, null, 2));

  return rval;
}

export async function createOpp(formData) {
  const validatedData = validateCreate(formData);

  if (!validatedData.success) {
    return { error: validatedData.error.format() };
  }

  const parsedData = validatedData.data;

  // console.log("\n\n org create: " + JSON.stringify(parsedData, null, 2));

  const data = {
    name: parsedData.name,
    type: parsedData.type,
    ownerId: parsedData.ownerId,
    orgId: parsedData.orgId == "" ? undefined : parsedData.orgId,
    personId: parsedData.personId == "" ? undefined : parsedData.personId,
    statusChangeDate: parsedData.statusChangeDate,
    closeDate: parsedData.closeDate,
    expectedOutcome: parsedData.expectedOutcome,
    closedOutcome: parsedData.closedOutcome,
    description: parsedData.description,
    opportunityType:
      parsedData.opportunityType == "" ? undefined : parsedData.opportunityType,
    opportunitySource:
      parsedData.opportunitySource == ""
        ? undefined
        : parsedData.opportunitySource,
    opportunityStatus:
      parsedData.opportunityStatus == ""
        ? undefined
        : parsedData.opportunityStatus,
    isActive: parsedData.isActive,
  };

  console.log("\n\nopp to create data: " + JSON.stringify(data));

  const rval = await prisma.opportunities.create({
    data: data,
  });

  console.log("\n\nopp after insert data: " + JSON.stringify(rval));

  return rval;
}

export async function destroyOpp(pid: string) {
  console.log("\n\n delete org: " + pid + "\n\n");
  await prisma.opportunities.delete({
    where: {
      id: pid,
    },
  });

  return;
}
