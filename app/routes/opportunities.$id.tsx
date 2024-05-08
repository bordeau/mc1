import {
  type ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";

import PlainAddress from "~/components/plainaddress";
import { getLikeNameOrgs, getOrgById } from "~/controllers/orgs";

import { blankAddress } from "~/components/utils";
import React from "react";
import { isAuthenticated } from "~/services/auth.server";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import { Roles } from "~/models/role";
import { getAllPersons, getLikeNamePersons } from "~/controllers/persons";
import { EmptyLetterTray } from "~/components/icons";
import { createPersonOrg } from "~/controllers/personsOrgs";
import { getOppById } from "~/controllers/opps";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing ID param");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const backm1 = url.searchParams.get("back");
  const whichBack = backm1 ? 1 : 0;

  let item;
  let persons;
  if (q == null) {
    [item, persons] = await Promise.all([
      getOppById(params.id),
      getAllPersons(),
    ]);
  }
  //
  else {
    [item, persons] = await Promise.all([
      getOppById(params.id),
      getLikeNamePersons(q),
    ]);
  }

  const oppTeam = item.opportunityTeam;

  // console.log("\n\norg loader org:" + JSON.stringify(org, null, 2));

  if (!item) {
    throw new Response("Not Found", { status: 404 });
  }
  return { currentUser, item, oppTeam, whichBack, q };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formdata = Object.fromEntries(await request.formData());
  /*
  console.log(
    "\n\nperson/org link formdata?: " + JSON.stringify(formdata, null, 2)
  );
*/

  const personorg = await createPersonOrg(formdata);

  /*
  console.log(
    "\n\npersonOorg post link personOrg?: " + JSON.stringify(personorg, null, 2)
  );
*/

  if (personorg.hasOwnProperty("error")) return personorg;
  else return redirect(`/organizations/${personorg.orgId}`);

  return {};
};

export default function OpportunitiesId() {
  const { currentUser, item, oppTeam, whichBack, q } =
    useLoaderData<typeof loader>();

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isManager = Roles.isManager(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  console.log("\n\n org detail: " + JSON.stringify(item, null, 2));

  return (
    <>
      <Nav
        isAdmin={isAdmin}
        isManager={isManager}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <h1>Opportunity Detail</h1>
      <SecondaryNav
        target="opportunities"
        id={item.id}
        canDelete={false}
        canCreate={true}
        canEdit={true}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={!whichBack}
        showBack1={whichBack}
        backTarget={"opportunities"}
        showBackTitle={!whichBack ? "Back to List" : "Back to Person Detail"}
        what="Opportunity"
      />
      <br />

      <div className="row">
        <h6 className="col-2 align-text-top">Name:</h6>
        <p className="col-7 lead align-text-top">{item.name}</p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Organization</h6>
        <p className="col-7 lead align-text-top">
          {item.orgs ? item.orgs.name : <EmptyLetterTray />}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Person</h6>
        <p className="col-7 lead align-text-top">
          {item.persons ? (
            item.persons.firstName + " " + item.persons.lastName
          ) : (
            <EmptyLetterTray />
          )}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Is Active?</h6>
        <p className="col-7 lead align-text-top">
          {item.isActive ? "Yes" : "No"}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Type:</h6>
        <p className="col-7 lead align-text-top">
          {item.opportunityStatus ? (
            item.opportunityStatus
          ) : (
            <EmptyLetterTray />
          )}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Type:</h6>
        <p className="col-7 lead align-text-top">
          {item.opportunityType ? item.opportunityType : <EmptyLetterTray />}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Industry:</h6>
        <p className="col-7 lead align-text-top">
          {item.opportunitySource ? (
            item.opportunitySource
          ) : (
            <EmptyLetterTray />
          )}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Description:</h6>
        <p className="col-7 lead align-text-top">
          {item.description ? item.description : <EmptyLetterTray />}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Owner:</h6>
        <p className="col-7 lead align-text-top">
          {item.owner.firstName + " " + item.owner.lastName}
        </p>
      </div>

      <h4 className="mt-xl-4">Opportunity Team</h4>
    </>
  );
}
