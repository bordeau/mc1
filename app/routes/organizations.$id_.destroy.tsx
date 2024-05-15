import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { destroyOrg, getOrgById } from "~/controllers/orgs";
import { isAuthenticated } from "~/services/auth.server";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";
import { Roles } from "~/models/role";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  invariant(params.orgId, "Missing org Id param");

  const id = Number(params.orgId);
  const org = await getOrgById(id);

  if (!org) {
    throw new Response("Not Found", { status: 404 });
  }

  return { currentUser, org };
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  console.log("\n\n delete form data: " + JSON.stringify(formData));
  const orgId = formData.org_id;

  if (formData.button === "yes") {
    console.log("\n\ndeleted org:" + orgId + "\n\n");
    await destroyOrg(Number(orgId));
    return redirect("/organizations");
  }

  return redirect("/organizations/" + orgId);
}

export default function DestroyOrg() {
  const { currentUser, org } = useLoaderData<typeof loader>();

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
      <h1>Organization Detail</h1>
      <SecondaryNav
        target="organizations"
        id={org.id}
        canDelete={false}
        canCreate={true}
        canEdit={true}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={!whichBack}
        showBack1={whichBack}
        backTarget={"organizations"}
        showBackTitle={!whichBack ? "Back to List" : "Back to Person Detail"}
        what="Organization"
      />
      <br />

      <Form key="persondelete" id="persondelete-form" method="post">
        <input type="hidden" name="org_id" value={org.id} />

        <div className="mg-3">
          <label className="form-label">
            Are you sure you want to delete org: {org.name}?
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
    </>
  );
}
