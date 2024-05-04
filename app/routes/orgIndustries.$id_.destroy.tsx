import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  destroyOrgIndustry,
  getOrgIndustryById,
} from "~/controllers/orgIndustries";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing id param");

  const id = params.id;
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  return json({ currentUser, id });
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  console.log("\n\n delete form data: " + JSON.stringify(formData));
  const id = formData.id;
  if (formData.button === "yes") {
    await destroyOrgIndustry(id);
    return redirect("/orgIndustries");
  } else {
    return redirect("/orgIndustries/" + id);
  }
}

export default function DeleteOrgIndustry() {
  const { currentUser, id } = useLoaderData<typeof loader>();
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
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={"orgIndustries"}
        what="Organizational Industries"
      />
      <br />
      <Form key="roledelete" id="roledelete-form" method="post">
        <input type="hidden" name="id" value={id} />
        <div className="mg-3">
          <label className="form-label">
            Are you sure you want to delete Org Industry: {id}?
          </label>
        </div>
        <div className="mg-3">
          <button
            type="submit"
            className="btn btn-primary"
            name="button"
            value="yes"
          >
            Yes
          </button>
          <button
            type="submit"
            className="btn btn-secondary"
            name="button"
            value="no"
          >
            No
          </button>
        </div>
      </Form>
    </div>
  );
}
