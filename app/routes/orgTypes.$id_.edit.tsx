import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getOrgTypeById, updateOrgType } from "~/controllers/orgTypes";
import { useActionData } from "react-router";
import React from "react";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  invariant(params.id, "Missing ID param");
  console.log("\n\nloader: " + params.id);

  const orgType = await getOrgTypeById(params.id);

  if (!orgType) {
    throw new Response("Org Type Not Found", { status: 404 });
  }
  return json({ currentUser, orgType });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  console.log("\n\nrole edit formdata?: " + JSON.stringify(formData));

  const orgType = await updateOrgType(formData);

  if (orgType.hasOwnProperty("error")) return orgType;
  else return redirect(`/orgTypes/${orgType.id}`);
};

export default function EditOrgType() {
  const data = useActionData<typeof action>();
  const { currentUser, orgType } = useLoaderData<typeof loader>();
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
      <h1>Edit Organization Type</h1>
      <SecondaryNav
        target="orgTypes"
        canDelete={false}
        canCreate={true}
        canEdit={false}
        canClone={true}
        viewLoginLog={false}
        viewDetail={true}
        showBack={true}
        backTarget={"orgTypes"}
        what="Organizational Type"
      />
      <br />

      <div className="bd-example">
        <Form key={orgType.id} id="org_type-form" method="post">
          <input type="hidden" name="id" value={orgType.id} />
          <div className="mg-3">
            <label htmlFor="id" className="form-label">
              Name
            </label>

            <input
              defaultValue={orgType.id}
              name="name"
              type="text"
              placeholder="Name"
              className="form-control"
              required={true}
            />
            {data && data.error.id && (
              <p className="text-danger">{data.error.id._errors[0]}</p>
            )}
          </div>
          <div className="mg-3">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="cancel" className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
