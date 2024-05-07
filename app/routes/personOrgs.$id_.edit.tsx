import {
  type ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";

import invariant from "tiny-invariant";

import FormAddress from "~/components/formaddress";

import { getPersonOrgById, updatePersonOrg } from "~/controllers/personsOrgs";
import { useActionData } from "react-router";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing Org ID param");

  // console.log("\n\nperson edit org loader:" + JSON.stringify(params));

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const personOrg = await getPersonOrgById(params.id);

  console.log("\n\n\n personOrg: " + JSON.stringify(personOrg, null, 2));

  // const org = await getOrgByOrgId(params.orgId);
  // const orgType = await getOrgTypeByOrgTypeId(org.org_type_id);

  // console.log("\n\norg loader org:" + JSON.stringify(org));
  // console.log("\n\norg loader org type:" + JSON.stringify(orgType));
  // if (!org) {
  // throw new Response("Not Found", { status: 404 });
  // }
  return { currentUser, personOrg };
};

export async function action({ request }: ActionFunctionArgs) {
  const formdata = Object.fromEntries(await request.formData());

  console.log(
    "\n\n personorg edit action form: " + JSON.stringify(formdata, null, 2)
  );

  const orgPerson = await updatePersonOrg(formdata);

  console.log("\n\n update personOrg result: " + JSON.stringify(orgPerson));

  if (orgPerson.hasOwnProperty("error")) return orgPerson;
  else return redirect(`/personOrgs/${orgPerson.id}`);
}

export default function PersonOrgEdit() {
  const { currentUser, personOrg } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const data = useActionData<typeof action>();

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
      <h1>Person Organization Edit</h1>
      <SecondaryNav
        target="personOrgs"
        id={personOrg.id}
        canDelete={false}
        canCreate={false}
        canEdit={true}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack1={true}
        backTarget={"personOrgs"}
        showBackTitle="Back to User Detail"
        what="Person Org Linkage"
      />
      <br />

      <Form key={personOrg.id} id="personorg-form" method="post">
        <input type="hidden" name="id" value={personOrg.id} />

        <div className="row">
          <div className="col-2 align-text-top">
            <label htmlFor="name" className="form-label">
              Person
            </label>
          </div>
          <div className="col-9 lead align-text-top">
            <p className="lead">
              {personOrg.person.firstName} {personOrg.person.lastName}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-2 align-text-top">
            <label htmlFor="name" className="form-label">
              Organization
            </label>
          </div>

          <div className="col-9 lead align-text-top">
            <p className="lead">{personOrg.org.name}</p>
          </div>
        </div>

        <div className="row">
          <div className="col-2 align-text-top">
            <label htmlFor="subOrg" className="form-label">
              Sub-Organization:
            </label>
          </div>
          <div className="col-9 lead align-text-top">
            <input
              defaultValue={personOrg.subOrg}
              name="subOrg"
              type="text"
              placeholder="Sub-Organization"
              className="form-control"
            />
            {data && data.error.subOrg && (
              <p className="text-danger">{data.error.subOrg._errors[0]}</p>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-2 align-text-top">
            <label htmlFor="title" className="form-label">
              Title:
            </label>
          </div>
          <div className="col-9 lead align-text-top">
            <input
              defaultValue={personOrg.title}
              name="title"
              type="text"
              placeholder="Title"
              className="form-control"
            />
            {data && data.error.title && (
              <p className="text-danger">{data.error.title._errors[0]}</p>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-2 align-text-top">
            <label htmlFor="phone" className="form-label">
              Phone:
            </label>
          </div>
          <div className="col-9 lead align-text-top">
            <input
              defaultValue={personOrg.phone}
              name="phone"
              type="text"
              placeholder="Phone"
              className="form-control"
            />
            {data && data.error.phone && (
              <p className="text-danger">{data.error.phone._errors[0]}</p>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-2 align-text-top">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
          </div>
          <div className="col-9 lead align-text-top">
            <input
              defaultValue={personOrg.email}
              name="email"
              type="text"
              placeholder="Email"
              className="form-control"
            />
            {data && data.error.email && (
              <p className="text-danger">{data.error.email._errors[0]}</p>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-2 align-text-top">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
          </div>
          <div className="col-9 lead align-text-top">
            <textarea
              defaultValue={personOrg.description}
              name="description"
              type="text"
              placeholder="Description"
              className="form-control"
            />
            {data && data.error.description && (
              <p className="text-danger">{data.error.description._errors[0]}</p>
            )}
          </div>
        </div>

        <div className="accordion-body">
          <FormAddress
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

        <div className="mg-3">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button type="reset" className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </Form>
    </>
  );
}
