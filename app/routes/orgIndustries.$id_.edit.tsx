import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getOrgTypeById, updateOrgType } from "~/controllers/orgTypes";
import { useActionData } from "react-router";
import React from "react";
import {
  getOrgIndustryById,
  updateOrgIndustry,
} from "~/controllers/orgIndustries";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import { Roles } from "~/models/role";
import { isAuthenticated } from "~/services/auth.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing id param");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  console.log("\n\nloader: " + params.id);

  const orgIndustry = await getOrgIndustryById(params.id);

  if (!orgIndustry) {
    throw new Response("Org Industry Not Found", { status: 404 });
  }
  return json({ currentUser, orgIndustry });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  console.log("\n\norgIndustry edit formdata?: " + JSON.stringify(formData));

  const orgIndustry = await updateOrgIndustry(formData);

  if (orgIndustry.hasOwnProperty("error")) return orgIndustry;
  else return redirect(`/orgIndustries/${orgIndustry.id}`);
};

export default function EditOrgType() {
  const { data } = useActionData<typeof action>();
  const { currentUser, orgIndustry } = useLoaderData<typeof loader>();

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
      <h1>User Detail</h1>
      <SecondaryNav
        target="orgIndustries"
        canDelete={false}
        canCreate={true}
        canEdit={true}
        canClone={true}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={"orgIndustries"}
        what="Organizational Industries"
      />
      <br />

      <h2>Edit Organization Type</h2>
      <div className="bd-example">
        <Form key={orgIndustry.id} id="org_type-form" method="post">
          <input type="hidden" name="currentId" value={orgIndustry.id} />
          <div className="mg-3">
            <label htmlFor="id" className="form-label">
              Name
            </label>

            <input
              defaultValue={orgIndustry.id}
              name="id"
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
