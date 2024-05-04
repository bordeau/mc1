-- CreateTable
CREATE TABLE "Persons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Persons_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "OrgTypes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OrgIndustries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Orgs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "address" TEXT,
    "description" TEXT,
    "website" TEXT,
    "orgType" TEXT,
    "orgIndustry" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdaAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "personsId" TEXT,
    CONSTRAINT "Orgs_orgType_fkey" FOREIGN KEY ("orgType") REFERENCES "OrgTypes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Orgs_orgIndustry_fkey" FOREIGN KEY ("orgIndustry") REFERENCES "OrgIndustries" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Orgs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Orgs_personsId_fkey" FOREIGN KEY ("personsId") REFERENCES "Persons" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PersonsOrgs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "subOrg" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "description" TEXT,
    "orgId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PersonsOrgs_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Orgs" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "PersonsOrgs_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Persons" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "OpportunityTeam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "isOurTeam" BOOLEAN NOT NULL DEFAULT true,
    "personId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OpportunityTeam_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Persons" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "OpportunityTeam_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunities" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "OpportunityStatuses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OpportunityTypes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OpportunitySources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Opportunities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Name your opportunity something meaningful',
    "statusChangeDate" DATETIME,
    "closeDate" DATETIME,
    "description" TEXT,
    "expectedOutcome" TEXT,
    "closedOutcome" TEXT,
    "activity" TEXT,
    "opportunityType" TEXT NOT NULL,
    "opportunitySource" TEXT NOT NULL,
    "opprtunityStatus" TEXT NOT NULL,
    "orgId" TEXT,
    "personId" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdaAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Opportunities_opportunityType_fkey" FOREIGN KEY ("opportunityType") REFERENCES "OpportunityTypes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Opportunities_opportunitySource_fkey" FOREIGN KEY ("opportunitySource") REFERENCES "OpportunitySources" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Opportunities_opprtunityStatus_fkey" FOREIGN KEY ("opprtunityStatus") REFERENCES "OpportunityStatuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Opportunities_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Orgs" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Opportunities_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Persons" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Opportunities_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonsOrgs_orgId_personId_key" ON "PersonsOrgs"("orgId", "personId");

-- CreateIndex
CREATE UNIQUE INDEX "OpportunityTeam_personId_opportunityId_key" ON "OpportunityTeam"("personId", "opportunityId");
