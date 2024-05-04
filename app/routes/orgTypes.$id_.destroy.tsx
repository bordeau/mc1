import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  destroyOrgType,
  getOrgTypeById,
  getOrgTypeByOrgTypeId,
} from "~/controllers/orgTypes";
import { isAuthenticated } from "~/services/auth.server";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";
import { Roles } from "~/models/role";

function myconfirm(n) {
  if (
    confirm(
      "Are you sure you want to delete Organizational Type: " + n + "?"
    ) == true
  )
    return true;
  else return false;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing org type ID param");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const orgType = await getOrgTypeById(params.id);

  return { currentUser, orgType };
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  console.log("\n\n delete form data: " + JSON.stringify(formData));
  const orgTypeId = formData.org_type_id;
  if (formData.button === "yes") {
    await destroyOrgType(orgTypeId);
    return redirect("/orgTypes");
  } else {
    return redirect("/orgTypes/" + orgTypeId);
  }
}

export default function EditRole() {
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
      <h1>User Detail</h1>
      <SecondaryNav
        target="orgTypes"
        canDelete={false}
        canCreate={true}
        canEdit={true}
        canClone={true}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={"orgTypes"}
        what="Organizational Types"
      />
      <br />
      <Form key="orgTypeIddelete" id="orgTypeIddelete-form" method="post">
        <input type="hidden" name="org_type_id" value={orgType.id} />
        <div className="mg-3">
          <label className="form-label">
            Are you sure you want to delete Organzational Type : {orgType.id}?
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
