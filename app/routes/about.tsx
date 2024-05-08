import NavNon from "~/components/navnon";
import React from "react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { isAuthenticated } from "~/services/auth.server";
import { useLoaderData } from "@remix-run/react";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import Aboutcomp from "~/components/aboutcomp";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);

  return json({ currentUser });
};
export default function About() {
  const { currentUser } = useLoaderData<typeof loader>();
  const isAdmin = Roles.isAdmin(currentUser.role);
  const isManager = Roles.isManager(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  if (isLoggedIn) {
    return (
      <>
        <Nav
          isAdmin={isAdmin}
          isManager={isManager}
          isLoggedIn={isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />

        <Aboutcomp />
      </>
    );
  }
  //
  else {
    return (
      <>
        <NavNon showRegister={true} showLogin={true} />

        <Aboutcomp />
      </>
    );
  }
}
