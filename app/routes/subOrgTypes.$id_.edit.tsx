import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { useActionData } from "react-router";
import React from "react";
import { isAuthenticated } from "~/services/auth.server";
import SecondaryNav from "~/components/secondarynav";
import NavBar from "~/components/nav";
import { PAGE_MARGIN } from "~/models/misc";
import { getSubOrgTypeById, updateSubOrgType } from "~/controllers/subOrgTypes";

const target = "subOrgTypes";
const what = "Sub-Org Type";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  invariant(params.id, "Missing ID param");
  // console.log("\n\nloader: " + params.id);

  const item = await getSubOrgTypeById(params.id);

  if (!item) {
    throw new Response("Org Type Not Found", { status: 404 });
  }
  return json({ currentUser, item });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  /*
  console.log(
    "\n\norgtype edit formdata?: " + JSON.stringify(formData, null, 2)
  );
*/
  const item = await updateSubOrgType(formData);
  /*
  console.log(
    "\n\n orgtype edit post action: " + JSON.stringify(orgType, null, 2)
  );
*/
  if (item.hasOwnProperty("error")) return item;
  else return redirect("/" + target + "/" + item.id);
};

export default function EditOrgType() {
  const data = useActionData<typeof action>();
  const { currentUser, item } = useLoaderData<typeof loader>();

  return (
    <>
      <NavBar
        role={currentUser.role}
        isLoggedIn={currentUser.isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <div className={PAGE_MARGIN}>
        <h1>Edit Sub-Org Type</h1>
        <SecondaryNav
          target="orgTypes"
          id={item.id}
          canDelete={false}
          canCreate={true}
          canEdit={false}
          canClone={false}
          viewLoginLog={false}
          viewDetail={true}
          showBack={true}
          backTarget={"orgTypes"}
          what="Organizational Type"
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
                  <p className="text-danger">
                    {data.error.isActive._errors[0]}
                  </p>
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
      </div>
    </>
  );
}
