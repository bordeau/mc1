import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";

import invariant from "tiny-invariant";

import PlainAddress from "~/components/plainaddress";

import { getPersonOrgId } from "~/controllers/personsOrgs";
import React from "react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  console.log("\n\nperson org loader:" + JSON.stringify(params));
  const orgPersonId = params.personOrgId;

  console.log("\n\nperson org id:" + orgPersonId);

  const orgPerson = await getPersonOrgId(Number(orgPersonId));

  console.log("\n\n\n personOrg: " + JSON.stringify(orgPerson));

  // invariant(params.personOrgId, "Missing Org ID param");

  // const org = await getOrgByOrgId(params.orgId);
  // const orgType = await getOrgTypeByOrgTypeId(org.org_type_id);

  // console.log("\n\norg loader org:" + JSON.stringify(org));
  // console.log("\n\norg loader org type:" + JSON.stringify(orgType));
  // if (!org) {
  // throw new Response("Not Found", { status: 404 });
  // }
  return { orgPerson };
};

export default function PersonOrgDetail() {
  const { orgPerson } = useLoaderData<typeof loader>();
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
  if (orgPerson.address != null) {
    // console.log("\n\n splitting before json " + JSON.stringify(tadd));

    address = JSON.parse(orgPerson.address);

    // console.log("\n\n splitting address " + JSON.stringify(address));
  }

  return (
    <div className="container-md">
      <h1>Person Organization Link Detail</h1>

      <div className="row">
        <h6 className="col-2 align-text-top">Person:</h6>
        <p className="col-7 lead align-text-top">
          {orgPerson.person.firstName} {orgPerson.person.lastName}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Organization:</h6>
        <p className="col-7 lead align-text-top">{orgPerson.org.name}</p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Sub-Organization:</h6>
        <p className="col-7 lead align-text-top">
          {orgPerson.subOrg ? orgPerson.subOrg : "?"}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Title:</h6>
        <p className="col-7 lead align-text-top">
          {orgPerson.title ? orgPerson.title : "?"}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Phone:</h6>
        <p className="col-7 lead align-text-top">
          {orgPerson.phone ? orgPerson.phone : "?"}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Email:</h6>
        <p className="col-7 lead align-text-top">
          {orgPerson.email ? (
            <a href={`mailto:` + orgPerson.email}>{orgPerson.email}</a>
          ) : (
            "?"
          )}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Description:</h6>
        <p className="col-7 lead align-text-top">
          {orgPerson.description ? orgPerson.description : "?"}
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
      <div className="border border-primary rounded-1">
        <nav className="border border-primary rounded-1">
          <Link
            to={`/personOrgs/` + orgPerson.id + `/edit`}
            className="nav-link"
            aria-current="page"
          >
            Edit
          </Link>

          <Link
            to={`/personOrgs/` + orgPerson.id + `/destroy`}
            className="nav-link"
            aria-current="page"
          >
            Delete
          </Link>

          <Link
            to={`/persons/` + orgPerson.person.id}
            className="nav-link"
            aria-current="page"
          >
            Back
          </Link>
        </nav>
      </div>
    </div>
  );
}
