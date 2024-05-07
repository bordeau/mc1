import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { isAuthenticated } from "~/services/auth.server";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";
import { Roles } from "~/models/role";

import { destroyOppSource, getOppSourceById } from "~/controllers/oppSources";
import {
  destroyOppStatue,
  destroyOppStatuses,
  getOppStatusById,
} from "~/controllers/oppStatuses";

const target = "opportunityStatuses";
const what = "Opportunity Status";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing org type ID param");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  let item = await getOppStatusById(params.id);

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
    await destroyOppStatuses(id);
    return redirect("/" + target);
  } else {
    return redirect("/" + target + "/" + id);
  }
}

export default function opportunitySourcesId_Destroy() {
  const { currentUser, item } = useLoaderData<typeof loader>();

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isManager = Roles.isManager(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  if (item === null) {
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
          The {what} is referenced by an Opportunity, to delete you will need to
          remove all references
        </p>
      </>
    );
  } else
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
      </>
    );
}
