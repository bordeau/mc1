import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { isAuthenticated } from "~/services/auth.server";
import SecondaryNav from "~/components/secondarynav";
import React from "react";

import { destroyOppType, getOppTypeById } from "~/controllers/oppTypes";
import NavBar from "~/components/nav";
import { PAGE_MARGIN } from "~/models/misc";

const target = "opportunityTypes";
const what = "Opportunity Type";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing org type ID param");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  let item = await getOppTypeById(params.id);

  //console.log(
  //  "\n\n delete org type loader:" + JSON.stringify(item, null, 2)
  //);

  if (item.opportunities.length === 0) return { currentUser, item };
  else {
    item = null;
    console.log(
      "\n\n attempt to delete " + what + " that is currently referenced"
    );
    return { currentUser, item };
  }
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  // console.log("\n\n delete form data: " + JSON.stringify(formData));
  const id = formData.id;
  if (formData.button === "yes") {
    await destroyOppType(id);
    return redirect("/" + target);
  } else {
    return redirect("/" + target + "/" + id);
  }
}

export default function opportunitySourcesId_Destroy() {
  const { currentUser, item } = useLoaderData<typeof loader>();

  if (item === null) {
    return (
      <>
        <NavBar
          role={currentUser.role}
          isLoggedIn={currentUser.isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />
        <div className={PAGE_MARGIN}>
          <h1>User Detail</h1>
          <SecondaryNav
            target={target}
            canDelete={false}
            canCreate={true}
            canEdit={true}
            canClone={true}
            viewLoginLog={false}
            viewDetail={false}
            showBack={true}
            backTarget={target}
            what={what}
          />
          <br />

          <p>
            The {what} is referenced by an Opportunity, to delete you will need
            to remove all references
          </p>
        </div>
      </>
    );
  } else
    return (
      <>
        <NavBar
          role={currentUser.role}
          isLoggedIn={currentUser.isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />
        <div className="mx-1">
          <h1>User Detail</h1>
          <SecondaryNav
            target={target}
            canDelete={false}
            canCreate={true}
            canEdit={true}
            canClone={true}
            viewLoginLog={false}
            viewDetail={false}
            showBack={true}
            backTarget={target}
            what={what}
          />
          <br />
          <Form key="orgTypeIddelete" id="orgTypeIddelete-form" method="post">
            <input type="hidden" name="id" value={item.id} />
            <div className="mg-3">
              <label className="form-label">
                Are you sure you want to delete {what} : {item.id}?
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
      </>
    );
}
