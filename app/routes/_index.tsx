import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import NavNon from "~/components/navnon";
import Nav from "~/components/nav";
import { isAuthenticatedNoRedirect } from "~/services/auth.server";
import { useLoaderData } from "@remix-run/react";
import { Roles } from "~/models/role";
import Aboutcomp from "~/components/aboutcomp";
import React from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "NSF CRM" },
    { name: "description", content: "Welcome to NSF CRM!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticatedNoRedirect(request);

  // console.log("\n\n index currentUser: " + JSON.stringify(currentUser));
  return { currentUser };
};

export default function Index() {
  const { currentUser } = useLoaderData<typeof loader>();

  if (currentUser) {
    const isAdmin = Roles.isAdmin(currentUser.role);
    const isLoggedIn = currentUser.isLoggedIn;
    return (
      <>
        <Nav
          isAdmin={isAdmin}
          isLoggedIn={isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />

        <Aboutcomp />
      </>
    );
  } else {
    return (
      <>
        <NavNon showRegister={true} showLogin={true} />

        <Aboutcomp />
      </>
    );
  }
}
