import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

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

const target = "orgIndustries";
const what = "Org Industry";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing id param");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  // console.log("\n\nloader: " + params.id);

  const item = await getOrgIndustryById(params.id);

  if (!item) {
    throw new Response("Org Industry Not Found", { status: 404 });
  }
  return json({ currentUser, item });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  console.log("\n\norgIndustry edit formdata?: " + JSON.stringify(formData));

  const item = await updateOrgIndustry(formData);

  if (item.hasOwnProperty("error")) return item;
  else return redirect("/" + target + "/" + item.id);
};

export default function EditOrgIndustry() {
  const data = useActionData<typeof action>();
  const { currentUser, item } = useLoaderData<typeof loader>();

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
      <h1>Edit {what}</h1>
      <SecondaryNav
        target={target}
        canDelete={false}
        canCreate={true}
        canEdit={false}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={target}
        what={what}
      />
      <br />

      <div className="bd-example">
        <Form key={item.id} id="org_type-form" method="post">
          <input type="hidden" name="currentId" value={item.id} />
          <div className="row">
            <div className="col-2 align-text-top">
              <label htmlFor="id" className="form-label">
                Name
              </label>
            </div>
            <div className="col-9 lead align-text-top">
              <input
                defaultValue={item.id}
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
          </div>
          <div className="row">
            <div className="col-2 align-text-top">
              <label htmlFor="isActive" className="form-label">
                Active?
              </label>
            </div>
            <div className="col-9 lead align-text-top">
              <select
                name="isActive"
                className="form-control"
                defaultValue={item.isActive ? "yes" : ""}
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
      </div>
    </>
  );
}
