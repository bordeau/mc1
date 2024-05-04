import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";

import { createRole, updateRole } from "~/controllers/roles";
import { z } from "zod";
import {
  createOrgIndustry,
  getOrgIndustryById,
} from "~/controllers/orgIndustries";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";
import { loader } from "~/routes/orgIndustries.$id";
import { isAuthenticated } from "~/services/auth.server";
import invariant from "tiny-invariant";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  return json({ currentUser });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formdata = Object.fromEntries(await request.formData());

  console.log("\n\norg industry edit formdata?: " + JSON.stringify(formdata));

  const orgIndustry = await createOrgIndustry(formdata);

  if (orgIndustry.hasOwnProperty("error")) return orgIndustry;
  else return redirect(`/orgIndustries/${orgIndustry.id}`);
};

export default function CreateOrgIndustry() {
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
      <h1>User Detail</h1>
      <SecondaryNav
        target="orgIndustries"
        canDelete={false}
        canCreate={false}
        canEdit={false}
        canClone={true}
        viewLoginLog={false}
        viewDetail={true}
        showBack={true}
        backTarget={"orgIndustries"}
        what="Organizational Industries"
      />
      <br />
      <h2>Create Organizational Industry</h2>
      <div className="bd-example">
        <Form id="role-form" method="post">
          <div className="mg-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>

            <input
              defaultValue=""
              name="id"
              type="text"
              placeholder="Name"
              className="form-control"
            />
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
