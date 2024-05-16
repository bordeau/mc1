import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
// existing imports

import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";
import { getOppTypeById } from "~/controllers/oppTypes";
import { getOppTeamById } from "~/controllers/opportunityTeam";
import { getOppById } from "~/controllers/opps";
import { getAllActivePersons, getLikeNamePersons } from "~/controllers/persons";
import { getAllUsersByIsActive } from "~/controllers/users";

const target = "opportunityTeam";
const what = "Opportunity Team Member";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  invariant(params.id, "Missing id param");

  const url = new URL(request.url);
  const re = url.searchParams.get("re");
  const ret = url.searchParams.get("ret");

  const [item] = await Promise.all([getOppTeamById(params.id)]);

  let data;
  if (item.user != null) {
    data = {
      id: params.id,
      name: item.opportunity.name,
      role: item.role,
      firstName: item.user.firstName,
      lastName: item.user.lastName,
      userId: item.userId,
      opportunityId: item.opportunityId,
      type: "Internal",
    };
  }
  //
  else if (item.person != null) {
    data = {
      id: params.id,
      name: item.opportunity.name,
      role: item.role,
      firstName: item.person.firstName,
      lastName: item.person.lastName,
      personId: item.personId,
      opportunityId: item.opportunityId,
      type: "External",
    };
  }

  // console.log("\n\n opportunityTeam item: " + JSON.stringify(item, null, 2));
  // console.log("\n\n persons: " + JSON.stringify(persons, null, 2));
  // console.log("\n\n users: " + JSON.stringify(users, null, 2));

  if (!item) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ currentUser, data, re, ret });
};

export default function opportunityTeamId() {
  const { currentUser, data, re, ret } = useLoaderData<typeof loader>();
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
      <h1>{what} Detail</h1>
      <SecondaryNav
        target={target}
        id={data.id}
        canDelete={true}
        canCreate={false}
        canEdit={true}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={"opportunities/" + data.opportunityId}
        showBackTitle={"Back to Opportunity Detail"}
        what={what}
      />
      <br />

      <div className="bd-example">
        <div className="row">
          <h6 className="col-2 align-text-top">Opportunity</h6>
          <p className="col-7 lead align-text-top">{data.name}</p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Team Member Name</h6>
          <p className="col-7 lead align-text-top">
            {data.firstName + " " + data.lastName}
          </p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Type</h6>
          <p className="col-7 lead align-text-top">{data.type}</p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Role</h6>
          <p className="col-7 lead align-text-top">{data.role}</p>
        </div>
      </div>
    </>
  );
}
