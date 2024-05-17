import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Link, Form, useSubmit } from "@remix-run/react";

import {
  getAllActiveOrgIndustries,
  getAllOrgIndustries,
} from "~/controllers/orgIndustries";
import { isAuthenticated } from "~/services/auth.server";
import SecondaryNav from "~/components/secondarynav";
import React, { useEffect } from "react";
import NavBar from "~/components/nav";
import { PAGE_MARGIN } from "~/models/misc";

const target = "orgIndustries";
const what = "Org Industry";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const qq = q == null ? false : true;

  let list;
  if (qq) list = await getAllOrgIndustries();
  else list = await getAllActiveOrgIndustries();

  return json({ currentUser, list, qq });
};

export default function Index() {
  const { currentUser, list, qq } = useLoaderData<typeof loader>();

  const submit = useSubmit();
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = qq || "";
    }
  }, [qq]);

  return (
    <>
      <NavBar
        role={currentUser.role}
        isLoggedIn={currentUser.isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <div className={PAGE_MARGIN}>
        <h1>Org Industries</h1>

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
                <Link
                  className="col-sm-9"
                  to={"/" + target + "/" + oi.id}
                  aria-current="page"
                >
                  {oi.id}
                </Link>
              </div>
              <div className="col-sm-2">
                <span>{oi.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
