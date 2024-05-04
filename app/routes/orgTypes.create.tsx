import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";

import { createRole, updateRole } from "~/controllers/roles";
import { z } from "zod";
import { createOrgType, getOrgTypeById } from "~/controllers/orgTypes";
import { useActionData } from "react-router";
import React from "react";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import { loader } from "~/routes/orgTypes.$id";
import invariant from "tiny-invariant";
import { isAuthenticated } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  return json({ currentUser });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formdata = Object.fromEntries(await request.formData());

  console.log("\n\nperson edit formdata?: " + JSON.stringify(formdata));

  const orgType = await createOrgType(formdata);

  if (orgType.hasOwnProperty("error")) return orgType;
  else return redirect(`/orgTypes/${orgType.id}`);
};

export default function CreateOrganizationType() {
  const data = useActionData<typeof action>();
  const { currentUser } = useLoaderData<typeof loader>();

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
      <h1>Create Organization Type</h1>
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
        <Form id="orgtype-form" method="post">
          <div className="mg-3">
            <label htmlFor="id" className="form-label">
              Name
            </label>

            <input
              defaultValue=""
              name="id"
              type="text"
              placeholder="Name"
              className="form-control"
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
