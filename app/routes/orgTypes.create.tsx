import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { createOrgType } from "~/controllers/orgTypes";
import { useActionData } from "react-router";
import React from "react";
import SecondaryNav from "~/components/secondarynav";

import { isAuthenticated } from "~/services/auth.server";
import NavBar from "~/components/nav";
import { PAGE_MARGIN } from "~/models/misc";

const target = "orgTypes";
const what = "Org Type";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  return json({ currentUser });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formdata = Object.fromEntries(await request.formData());

  // console.log("\n\norgtype edit formdata?: " + JSON.stringify(formdata));

  const item = await createOrgType(formdata);

  if (item.hasOwnProperty("error")) return item;
  else return redirect("/" + target + "/" + item.id);
};

export default function CreateOrganizationType() {
  const data = useActionData<typeof action>();
  const { currentUser } = useLoaderData<typeof loader>();

  return (
    <>
      <NavBar
        role={currentUser.role}
        isLoggedIn={currentUser.isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <div className={PAGE_MARGIN}>
        <h1>Create {what}</h1>
        <SecondaryNav
          target={target}
          canDelete={false}
          canCreate={false}
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
          <Form id="orgtype-form" method="post">
            <input type="hidden" name="orderBy" value="100" />
            <div className="row">
              <div className="col-2 align-text-top">
                <label htmlFor="id" className="form-label">
                  Name
                </label>
              </div>
              <div className="col-9 lead align-text-top">
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
            </div>

            <div className="row">
              <div className="col-2 align-text-top">
                <label htmlFor="isActive" className="form-label">
                  Active?
                </label>
              </div>
              <div className="col-9 lead align-text-top">
                <select name="isActive" className="form-control">
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
