import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
// existing imports

import { getOrgIndustryById } from "~/controllers/orgIndustries";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";

const target = "orgIndustries";
const what = "Org Industry";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  invariant(params.id, "Missing id param");

  const item = await getOrgIndustryById(params.id);

  if (!item) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ currentUser, item });
};

export default function orgIndustriesId() {
  const { currentUser, item } = useLoaderData<typeof loader>();
  const isAdmin = Roles.isAdmin(currentUser.role);
  const isManager = Roles.isManager(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  return (
    <>
      <Nav
        isAdmin={isAdmin}
        isManager={isManager}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <h1>Organizational Industry Detail</h1>
      <SecondaryNav
        target={target}
        id={item.id}
        canDelete={true}
        canCreate={true}
        canEdit={true}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={target}
        what={what}
      />
      <br />

      <div className="bd-example">
        <div className="row">
          <div className="col lead">{item.id}</div>
          <div className="col lead">
            {item.isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </div>
    </>
  );
}
