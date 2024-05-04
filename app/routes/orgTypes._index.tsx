import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { getAllOrgTypes } from "~/controllers/orgTypes";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const orgTypes = await getAllOrgTypes();

  return json({ currentUser, orgTypes });
};

export default function Index() {
  const { currentUser, orgTypes } = useLoaderData<typeof loader>();

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isManager = Roles.isManager(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  return (
    <div className="container-md">
      <Nav
        isAdmin={isAdmin}
        isManager={isManager}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <h1>Organization Types</h1>
      <SecondaryNav
        target="orgTypes"
        canDelete={false}
        canCreate={true}
        canEdit={false}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={""}
        showBackTitle="To Dashboard"
        what="Organizational Type"
      />
      <br />

      <nav className="nav flex-column">
        {orgTypes.map((o) => (
          <li key={o.id}>
            <h5>
              <Link
                to={`/orgTypes/${o.id}`}
                className="nav-link"
                aria-current="page"
              >
                {o.id}
              </Link>
            </h5>
          </li>
        ))}
      </nav>
    </div>
  );
}
