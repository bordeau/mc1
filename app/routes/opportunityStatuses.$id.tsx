import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
// existing imports

import { isAuthenticated } from "~/services/auth.server";
import NavBar from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";
import { getOppStatusById } from "~/controllers/oppStatuses";
import { PAGE_MARGIN } from "~/models/misc";

const target = "opportunityStatuses";
const what = "Opportunity Status";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  invariant(params.id, "Missing id param");

  const item = await getOppStatusById(params.id);

  if (!item) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ currentUser, item });
};

export default function opportunityStatusesId() {
  const { currentUser, item } = useLoaderData<typeof loader>();

  return (
    <>
      <NavBar
        role={currentUser.role}
        isLoggedIn={currentUser.isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <div className={PAGE_MARGIN}>
        <h1>{what} Detail</h1>
        <SecondaryNav
          target={target}
          id={item.id}
          canDelete={true}
          canCreate={true}
          canEdit={true}
          canClone={false}
          viewLoginLog={false}
          viewDetail={false}
          showBack={true}
          backTarget={target}
          what={what}
        />
        <br />
        <p>fix so you can't edit or delete Lead Converted To Opportunity</p>

        <div className="bd-example">
          <div className="row">
            <div className="col lead">{item.id}</div>
            <div className="col lead">
              {item.isActive ? "Active" : "Inactive"}
            </div>
            <div className="col lead">
              {item.type == "O" ? "Opportunity" : "Lead"}
            </div>
            <div className="col lead">
              {item.isClosed ? "Closed Type" : "Open"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
