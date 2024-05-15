import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { destroyPerson, getPersonById } from "~/controllers/persons";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";
import { destroyPersonOrg, getPersonOrgById } from "~/controllers/personsOrgs";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  invariant(params.id, "Missing id param");

  const url = new URL(request.url);
  const re = url.searchParams.get("re");
  const ret = url.searchParams.get("ret");

  console.log("\n\n re: " + re);
  console.log("\n\n ret: " + ret);

  const item = await getPersonOrgById(params.id);

  return { currentUser, item, re, ret };
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  // console.log("\n\n delete form data: " + JSON.stringify(formData));
  const id = formData.id;
  const re = formData.re;

  if (formData.button === "yes") {
    console.log("\n\ndeleted personOrg:" + id + "\n\n");
    await destroyPersonOrg(id);
    return redirect("/" + re);
  }

  if (formData.button === "no") {
    return redirect("/personOrgs/" + id);
  }

  return redirect("/" + re);
}

export default function PersonOrgsId_Destroy() {
  const { currentUser, item, re, ret } = useLoaderData<typeof loader>();

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
      <h1>User Detail</h1>
      <SecondaryNav
        target="personOrgs"
        id={item.id}
        canDelete={false}
        canCreate={true}
        canEdit={false}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={re}
        showBackTitle={ret}
        what="Person Org Association"
      />
      <br />

      <Form key="persondelete" id="persondelete-form" method="post">
        <input type="hidden" name="ret" value={ret} />
        <input type="hidden" name="re" value={re} />
        <input type="hidden" name="id" value={item.id} />

        <div className="mg-3">
          <label className="form-label">
            Are you sure you want to delete Person Org Association?
            <ul>
              <li>Org: {item.org.name}</li>
              <li>
                Person: {item.person.firstName + " " + item.person.lastName}
              </li>
            </ul>
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
