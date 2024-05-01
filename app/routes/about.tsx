import NavNon from "~/components/navnon";
import React from "react";

export default function About() {
  return (
    <>
      <NavNon showRegister={true} showLogin={true} />

      <h1>Welcome to NSF CRM</h1>
      <p>
        Building a CRM as an experiment using Remix, Remix Auth, React, SQLite,
        Prisma, Zod, Resend
      </p>
    </>
  );
}
