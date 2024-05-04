import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
// existing imports

import { getOrgIndustryById } from "~/controllers/orgIndustries";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  invariant(params.id, "Missing id param");

  const orgIndustry = await getOrgIndustryById(params.id);

  if (!orgIndustry) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ currentUser, orgIndustry });
};

export default function Contact() {
  const { currentUser, orgIndustry } = useLoaderData<typeof loader>();
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
      <h1>Organizational Industry Detail</h1>
      <SecondaryNav
        target="orgIndustries"
        id={orgIndustry.id}
        canDelete={false}
        canCreate={true}
        canEdit={true}
        canClone={true}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={"orgIndustries"}
        what="Organizational Industry"
      />
      <br />

      <div className="bd-example">
        <h6 className="card-title">Name:</h6>
        <p className="lead">{orgIndustry.id}</p>
      </div>
    </div>
  );
}
