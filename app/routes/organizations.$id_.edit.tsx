import {
  type ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";

import invariant from "tiny-invariant";

import FormAddress from "~/components/formaddress";
import { useActionData } from "react-router";
import { getAllOrgTypes } from "~/controllers/orgTypes";
import { getOrgById, updateOrg } from "~/controllers/orgs";
import React from "react";
import { getAllOrgIndustries } from "~/controllers/orgIndustries";
import { blankAddress } from "~/components/utils";
import { isAuthenticated } from "~/services/auth.server";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import { Roles } from "~/models/role";
import { getAllUsers } from "~/controllers/users";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing ID param");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const [org, orgTypes, orgIndustries, users] = await Promise.all([
    getOrgById(params.id),
    getAllOrgTypes(),
    getAllOrgIndustries(),
    getAllUsers(),
  ]);

  //console.log("\n\nperson loader:" + JSON.stringify(ownerPersons));
  if (!org) {
    throw new Response("Org Not Found", { status: 404 });
  }
  // console.log("\n\n org edit:" + JSON.stringify(org, null, 2));
  // console.log("\n\n orgTypes=" + JSON.stringify(orgTypes, null, 2 ));
  // console.log("\n\n orgIndustries=" + JSON.stringify(orgIndustries, null, 2));

  return { currentUser, org, orgTypes, orgIndustries, users };
};

export async function action({ request }: ActionFunctionArgs) {
  const formdata = Object.fromEntries(await request.formData());

  const org = await updateOrg(formdata);

  console.log("\n\n update result: " + JSON.stringify(org));

  if (org.hasOwnProperty("error")) return org;
  else return redirect(`/organizations/${org.id}`);
}

export default function OrgEdit() {
  const { currentUser, org, orgTypes, orgIndustries, users } =
    useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  const navigate = useNavigate();
  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  let address = blankAddress("organizational");
  if (org.address != null) {
    address = JSON.parse(org.address);
  }

  return (
    <>
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
        canEdit={false}
        canClone={false}
        viewLoginLog={false}
        viewDetail={true}
        showBack={true}
        backTarget={"organizations"}
        what="Organization"
      />
      <br />

      <h1>Organization Edit</h1>

      <Form key={org.id} id="orgedit-form" method="post">
        <input type="hidden" name="id" value={org.id} />
        <input type="hidden" name="ownerId" value={org.ownerId} />
        <div className="mg-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>

          <input
            defaultValue={org.name}
            name="name"
            type="text"
            placeholder="Name"
            className="form-control"
          />
          {data && data.error.name && (
            <p className="text-danger">{data.error.name._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="phone" className="form-label">
            Type:
          </label>

          <select
            name="orgType"
            className="form-control"
            defaultValue={org.orgType}
          >
            <option value="">Choose Organization Type</option>
            {orgTypes.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id}
              </option>
            ))}
          </select>
          {data && data.error.orgType && (
            <p className="text-danger">{data.error.orgType._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="phone" className="form-label">
            Industry:
          </label>

          <select
            name="orgIndustry"
            className="form-control"
            defaultValue={org.orgIndustry}
          >
            <option value="">Choose Industry</option>
            {orgIndustries.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id}
              </option>
            ))}
          </select>
          {data && data.error.orgIndustry && (
            <p className="text-danger">{data.error.orgIndustry._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="website" className="form-label">
            Website:
          </label>

          <input
            defaultValue={org.website}
            name="website"
            type="text"
            placeholder="Website"
            className="form-control"
          />
          {data && data.error.name && (
            <p className="text-danger">{data.error.website._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="isActive" className="form-label">
            Active?
          </label>

          <select
            name="isActive"
            className="form-control"
            defaultValue={org.isActive ? "yes" : ""}
          >
            <option key="yes" value="yes">
              Yes
            </option>
            <option key="no" value="">
              No
            </option>
          </select>
          {data && data.error.isActive && (
            <p className="text-danger">{data.error.isActive._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>

          <textarea
            defaultValue={org.description}
            name="description"
            type="text"
            placeholder="Description"
            className="form-control"
          />
          {data && data.error.description && (
            <p className="text-danger">{data.error.description._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <FormAddress
            type="organizations"
            typeLabel="Organizational Address"
            street1={address.street1}
            street2={address.street2}
            city={address.city}
            state={address.state}
            country={address.country}
            zip={address.zip}
            data={data}
          />
        </div>

        <div className="mg-3">
          <label htmlFor="ownerId" className="form-label">
            Owner:
          </label>

          {org.ownerId === currentUser.id ? (
            <select
              name="ownerId"
              className="form-control"
              defaultValue={org.ownerId}
            >
              <option value="">Choose Owner</option>
              {users.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.lastName}, {o.firstName}
                </option>
              ))}
            </select>
          ) : (
            <p className="lead">
              {org.owner.firstName + " " + org.owner.lastName}
            </p>
          )}
          {data && data.error.ownerId && (
            <p className="text-danger">{data.error.ownerId._errors[0]}</p>
          )}
        </div>

        <div className="mg-3 pt-5  float-none">
          <div className="border">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="reset" className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </Form>
    </>
  );
}
