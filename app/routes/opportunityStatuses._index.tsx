import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Link, Form, useSubmit } from "@remix-run/react";

import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import {
  getAllActiveOppStatuses,
  getAllOppStatuses,
} from "~/controllers/oppStatuses";
import React, { useEffect } from "react";

const target = "opportunityStatuses";
const what = "Opportunity Status";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const qq = q == null ? false : true;

  let list;
  if (qq) list = await getAllOppStatuses();
  else list = await getAllActiveOppStatuses();

  return json({ currentUser, list });
};

export default function OpportunityStatuses_index() {
  const { currentUser, list, qq } = useLoaderData<typeof loader>();

  const submit = useSubmit();
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = qq || "";
    }
  }, [qq]);

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

      <div>
        <h1>{what}es</h1>
      </div>
      <SecondaryNav
        target={target}
        canDelete={false}
        canCreate={true}
        canEdit={false}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        showBack1={false}
        reOrder={true}
        backTarget={"dashboard"}
        showBackTitle="To Dashboard"
        what={what}
      />
      <br />

      <Form
        id="search-form"
        role="search"
        onChange={(event) => submit(event.currentTarget)}
      >
        <input
          value="true"
          defaultChecked={qq}
          id="q"
          name="q"
          placeholder="Search"
          type="checkbox"
        />
        <label htmlFor="q" className="form-label">
          Show Active & Inactive
        </label>

        {/* existing elements */}
      </Form>

      <nav className="nav flex-column">
        {list.map((oi) => (
          <div className="row" key={oi.id}>
            <div className="col-sm-9">
              <Link to={"/" + target + "/" + oi.id} className="nav-link">
                {oi.id}
              </Link>
            </div>
            <div className="col-sm-2">
              <span>{oi.isActive ? "Active" : "Inactive"}</span>
            </div>
          </div>
        ))}
      </nav>
    </>
  );
}
