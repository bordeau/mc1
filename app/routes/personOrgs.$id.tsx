import {
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";

import invariant from "tiny-invariant";

import PlainAddress from "~/components/plainaddress";

import { getPersonOrgById } from "~/controllers/personsOrgs";
import React from "react";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import { EmptyLetterTray } from "~/components/icons";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  //console.log("\n\nperson org loader:" + JSON.stringify(params));
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  invariant(params.id, "Missing id param");

  const id = params.id;

  const url = new URL(request.url);
  const re = url.searchParams.get("re");
  const ret = url.searchParams.get("ret");

  // console.log("\n\n re: " + re);
  // console.log("\n\n ret: " + ret);

  //console.log("\n\nperson org id:" + id);

  const personOrg = await getPersonOrgById(id);

  //console.log("\n\n\n personOrg: " + JSON.stringify(personOrg, null, 2));

  // invariant(params.personOrgId, "Missing Org ID param");

  // const org = await getOrgByOrgId(params.orgId);
  // const orgType = await getOrgTypeByOrgTypeId(org.org_type_id);

  // console.log("\n\norg loader org:" + JSON.stringify(org));
  // console.log("\n\norg loader org type:" + JSON.stringify(orgType));
  // if (!org) {
  // throw new Response("Not Found", { status: 404 });
  // }
  return { currentUser, personOrg, re, ret };
};

export default function PersonOrgDetail() {
  const { currentUser, personOrg, re, ret } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  let address = {
    address_type: "organizational",
    street1: "",
    street2: "",
    city: "",
    zip: "",
    state: "",
    country: "",
  };
  if (personOrg.address != null) {
    // console.log("\n\n splitting before json " + JSON.stringify(tadd));

    address = JSON.parse(personOrg.address);

    // console.log("\n\n splitting address " + JSON.stringify(address));
  }

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
      <h1>Person Organization Association Detail</h1>
      <SecondaryNav
        target="personOrgs"
        id={personOrg.id}
        canDelete={true}
        re={re}
        ret={ret}
        canCreate={false}
        canEdit={true}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={re}
        showBackTitle={ret}
        what="Person Org Association"
      />
      <br />

      <div className="row">
        <h6 className="col-2 align-text-top">Person:</h6>
        <p className="col-7 lead align-text-top">
          {personOrg.person.firstName} {personOrg.person.lastName}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Organization:</h6>
        <p className="col-7 lead align-text-top">{personOrg.org.name}</p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Sub-Organization:</h6>
        <p className="col-7 lead align-text-top">
          {personOrg.subOrg ? personOrg.subOrg : <EmptyLetterTray />}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Title:</h6>
        <p className="col-7 lead align-text-top">
          {personOrg.title ? personOrg.title : <EmptyLetterTray />}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Phone:</h6>
        <p className="col-7 lead align-text-top">
          {personOrg.phone ? personOrg.phone : <EmptyLetterTray />}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Email:</h6>
        <p className="col-7 lead align-text-top">
          {personOrg.email ? (
            <a href={`mailto:` + personOrg.email}>{personOrg.email}</a>
          ) : (
            <EmptyLetterTray />
          )}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Description:</h6>
        <p className="col-7 lead align-text-top">
          {personOrg.description ? personOrg.description : <EmptyLetterTray />}
        </p>
      </div>

      <div className="accordion-body">
        <PlainAddress
          type="organizational"
          typeLabel="Organizational Address"
          street1={address.street1}
          street2={address.street2}
          city={address.city}
          state={address.state}
          country={address.country}
          zip={address.zip}
        />
      </div>
    </>
  );
}
