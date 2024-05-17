import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import SecondaryNav from "~/components/secondarynav";
import React from "react";
import { isAuthenticated } from "~/services/auth.server";
import { useActionData } from "react-router";
import { createOppType } from "~/controllers/oppTypes";
import NavBar from "~/components/nav";
import { PAGE_MARGIN } from "~/models/misc";

const target = "opportunityTypes";
const what = "Opportunity Type";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  return json({ currentUser });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formdata = Object.fromEntries(await request.formData());

  console.log("\n\norg industry edit formdata?: " + JSON.stringify(formdata));

  const item = await createOppType(formdata);

  if (item.hasOwnProperty("error")) return item;
  else return redirect("/" + target + "/" + item.id);
};

export default function opportunitySourcesCreate() {
  const { currentUser } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

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
          <Form id="role-form" method="post">
            <input type="hidden" name="orderBy" value="100" />
            <div className="row">
              <div className="col-2 align-text-top">
                <label htmlFor="name" className="form-label">
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
