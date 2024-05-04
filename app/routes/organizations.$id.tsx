import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData, useNavigate, useParams } from "@remix-run/react";

import invariant from "tiny-invariant";

import PlainAddress from "~/components/plainaddress";
import { getOrgById } from "~/controllers/orgs";

import { blankAddress } from "~/components/utils";
import React from "react";
import { isAuthenticated } from "~/services/auth.server";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import { Roles } from "~/models/role";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing ID param");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const org = await getOrgById(params.id);

  // console.log("\n\norg loader org:" + JSON.stringify(org, null, 2));

  if (!org) {
    throw new Response("Not Found", { status: 404 });
  }
  return { org, currentUser };
};

export default function OrgDetail() {
  const { org, currentUser } = useLoaderData<typeof loader>();

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  let address = blankAddress("organizational");
  if (org.address != null) {
    address = JSON.parse(org.address);

    // console.log("\n\n splitting address " + JSON.stringify(address, null, 2 ));
  }

  return (
    <>
      <div className="container-md">
        <Nav
          isAdmin={isAdmin}
          isLoggedIn={isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />
        <h1>User Detail</h1>
        <SecondaryNav
          target="organizations"
          id={org.id}
          canDelete={false}
          canCreate={true}
          canEdit={true}
          canClone={true}
          viewLoginLog={false}
          viewDetail={true}
          showBack={true}
          backTarget={"organizations"}
          what="Organization"
        />
        <br />

        <h1>Organization Detail</h1>

        <div className="row">
          <h6 className="col-2 align-text-top">Name:</h6>
          <p className="col-7 lead align-text-top">{org.name}</p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Is Active?</h6>
          <p className="col-7 lead align-text-top">
            {org.isActive ? "Yes" : "No"}
          </p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Type:</h6>
          <p className="col-7 lead align-text-top">
            {org.orgType ? org.orgType : "?"}
          </p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Industry:</h6>
          <p className="col-7 lead align-text-top">
            {org.orgIndustry ? org.orgIndustry : "?"}
          </p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Website:</h6>
          <p className="col-7 lead align-text-top">
            {org.website ? org.website : "?"}
          </p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Description:</h6>
          <p className="col-7 lead align-text-top">
            {org.description ? org.description : "?"}
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

        <div className="row">
          <h6 className="col-2 align-text-top">Owner:</h6>
          <p className="col-7 lead align-text-top">
            {org.owner.personOwners[0].firstName +
              " " +
              org.owner.personOwners[0].lastName}
          </p>
        </div>
      </div>
    </>
  );
}
