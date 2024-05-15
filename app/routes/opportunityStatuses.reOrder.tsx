import {
  type ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData, Link, useSubmit, Form } from "@remix-run/react";

import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";

import React, { useEffect } from "react";
import { OrderByType } from "~/models/misc";
import {
  getAllActiveOppStatuses,
  getAllOppStatuses,
  updateOppStatusesReOrder,
} from "~/controllers/oppStatuses";

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

  return json({ currentUser, list, qq });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  const data: OrderByType[] = [];
  let j = 0;
  let row: OrderByType = {};
  for (const pp in formData) {
    const i = pp.split("_");
    const n = Number(i[1]);
    if (n == j) {
      if (i[0] == "id") row.id = formData[pp];
      else if (i[0] == "origOrderBy") row.orig = Number(formData[pp]);
      else if (i[0] == "orderBy") {
        row.new = Number(formData[pp]);
        if (row.new != row.orig) data.push(row);
      }
    }
    //
    else {
      row = {};
      j++;
      if (n == j) {
        if (i[0] == "id") row.id = formData[pp];
      }
    }
  }

  //console.log("\n\n data: " + JSON.stringify(data, null, 2));

  const rval = await updateOppStatusesReOrder(data);

  /*
	console.log(
	  "\n\n orgtype edit post action: " + JSON.stringify(orgType, null, 2)
	);

    if (item.hasOwnProperty("error")) return item;
    // else return redirect(`/opportunitySources/${item.id}`);
    else return redirect("/" + target + "/" + item.id);

     */
  if (true) return redirect("/" + target);
};

export default function OpportunityStatusesReOrder() {
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
        <h1>Re-order {what}s</h1>
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
        backTarget={target}
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

      <Form key="oppTypeIndex" id="oppTypeIndex" method="post">
        <nav className="nav flex-column">
          <div className="row">
            <div className="col-sm-7">Name</div>
            <div className="col-sm-2">Is Active</div>
            <div className="col-sm-2">Order</div>
          </div>

          {list.map((oi, index) => (
            <div className="row" key={oi.id}>
              <input type="hidden" name={"id_" + index} value={oi.id} />
              <input
                type="hidden"
                name={"origOrderBy_" + index}
                value={oi.orderBy}
              />
              <div className="col-sm-7">
                <Link
                  to={"/" + target + "/" + oi.id}
                  className="nav-link"
                  aria-current="page"
                >
                  {oi.id}
                </Link>
              </div>
              <div className="col-sm-2">
                <span>{oi.isActive ? "Active" : "Inactive"}</span>
              </div>
              <div className="col-sm-2">
                <input
                  defaultValue={oi.orderBy}
                  name={"orderBy_" + index}
                  type="text"
                  inputMode="numeric"
                  pattern="^[0-9]*$"
                  className="form-control"
                />
              </div>
            </div>
          ))}
        </nav>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button type="reset" className="btn btn-secondary">
          Cancel
        </button>
        <br />
        <h4>Sorting Rules</h4>
        <ul>
          <li>
            Sort order will be in ascending order by Order number. Make sure
            that you only enter numbers in the Order field.
          </li>
          <li>
            To sort alphabetically, use the same number in each Order field
          </li>
          <li>
            For any items where the Order number is the same, these will sort
            alphabetically.
          </li>
        </ul>
      </Form>
    </>
  );
}
