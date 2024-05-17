import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import React, { useEffect } from "react";
import SecondaryNav from "~/components/secondarynav";
import { isAuthenticated } from "~/services/auth.server";
import {
  getAllActiveLeadOpps,
  getAllOOpps,
  getAllActiveOpps,
  getLikeNameLeadOpps,
  getLikeNameOOpps,
  getLikeNameOpps,
  getAllActiveOOpps,
  getLikeNameActiveLeadOpps,
  getLikeNameActiveOOpps,
  getLikeNameActiveOpps,
  getAllOpps,
  getAllLeadOpps,
} from "~/controllers/opps";
import { EmptyLetterTray } from "~/components/icons";
import NavBar from "~/components/nav";
import { PAGE_MARGIN } from "~/models/misc";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const url = new URL(request.url);
  let q = url.searchParams.get("q");
  const l = url.searchParams.get("l");
  const a = url.searchParams.get("a");
  let ll;
  if (l == "1") ll = 1;
  else if (l == "2") ll = 2;
  else ll = 3;
  if (q == "") q = null;
  let aa;
  if (a == "1") aa = 1;
  else if (a == "2") aa = 2;
  else aa = 1;
  //console.log("\n\n q:" + q);
  //console.log("\n\n l:" + l + " ll:" + ll);

  let list;
  if (q == null) {
    if (aa == 1) {
      if (ll == 3) list = await getAllActiveOpps();
      else if (ll == 2) list = await getAllActiveOOpps();
      else if (ll == 1) list = await getAllActiveLeadOpps();
    }
    //
    else {
      if (ll == 3) list = await getAllOpps();
      else if (ll == 2) list = await getAllOOpps();
      else if (ll == 1) list = await getAllLeadOpps();
    }

    // console.log("\n\n opps: " + JSON.stringify(list, null, 2));

    return json({ currentUser, list, q, ll, aa });
  }
  //
  else {
    if (aa == 1) {
      if (ll == 3) list = await getLikeNameActiveOpps(q);
      else if (ll == 2) list = await getLikeNameActiveOOpps(q);
      else if (ll == 1) list = await getLikeNameActiveLeadOpps(q);
    }
    //
    else {
      if (ll == 3) list = await getLikeNameOpps(q);
      else if (ll == 2) list = await getLikeNameOOpps(q);
      else if (ll == 1) list = await getLikeNameLeadOpps(q);
    }

    // console.log("\n\n opps: " + JSON.stringify(list, null, 2));

    return json({ currentUser, list, q, ll, aa });
  }
};

export default function Opportunities_index() {
  const { currentUser, list, q, ll, aa } = useLoaderData<typeof loader>();

  const submit = useSubmit();
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <>
      <NavBar
        role={currentUser.role}
        isLoggedIn={currentUser.isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <div className={PAGE_MARGIN}>
        <h1>Opportunities</h1>
        <SecondaryNav
          target="opportunities"
          canDelete={false}
          canCreate={true}
          createLead={true}
          canEdit={false}
          canClone={false}
          viewLoginLog={false}
          viewDetail={false}
          showBack={true}
          backTarget={"dashboard"}
          showBackTitle="To Dashboard"
          showBack1={false}
          what="Opportunity"
        />
        <br />

        <Form
          id="search-form"
          role="search"
          onChange={(event) => submit(event.currentTarget)}
        >
          <input
            aria-label="Search opportunities"
            defaultValue={q || ""}
            id="q"
            name="q"
            placeholder="Search"
            type="search"
          />
          &nbsp;
          <input
            value="1"
            defaultChecked={ll === 1}
            id="l1"
            name="l"
            placeholder="Search"
            type="radio"
          />
          <label htmlFor="l1" className="form-label">
            Leads Only
          </label>
          &nbsp;
          <input
            value="2"
            defaultChecked={ll === 2}
            id="l2"
            name="l"
            placeholder="Search"
            type="radio"
          />
          <label htmlFor="l2" className="form-label">
            Opportunities Only
          </label>
          &nbsp;
          <input
            value="3"
            defaultChecked={ll === 3}
            id="l3"
            name="l"
            placeholder="Search"
            type="radio"
          />
          <label htmlFor="l3" className="form-label">
            Both Leads and Opportunities
          </label>
          &nbsp; &nbsp; &nbsp;
          <input
            value="1"
            defaultChecked={aa === 1}
            id="a1"
            name="a"
            placeholder="Search"
            type="radio"
          />
          <label htmlFor="l1" className="form-label">
            Active Only
          </label>
          &nbsp;
          <input
            value="2"
            defaultChecked={aa === 2}
            id="a2"
            name="a"
            placeholder="Search"
            type="radio"
          />
          <label htmlFor="l2" className="form-label">
            Active and Inactive
          </label>
        </Form>

        <nav className="nav flex-column">
          <div className="row">
            <div className="col-sm-5">Name</div>
            <div className="col-sm-2">Status</div>
            {ll == 3 ? <div className="col-sm-2">Lead or Opp</div> : <></>}
            {ll == 2 ? <div className="col-sm-2">Active/Inactive</div> : <></>}
          </div>
          {list.map((nn) => (
            <div className="row" key={nn.id}>
              <div className="col-sm-5">
                <Link
                  to={`/opportunities/${nn.id}`}
                  className="nav-link"
                  aria-current="page"
                >
                  {nn.name}
                </Link>
              </div>
              <div className="col-sm-2">
                {nn.opportunityStatus ? (
                  nn.opportunityStatus
                ) : (
                  <EmptyLetterTray />
                )}
              </div>
              {ll == 3 ? (
                <div className="col-sm-2">
                  {nn.type == "O" ? "Opportunity" : "Lead"}
                </div>
              ) : (
                <></>
              )}
              {ll == 2 ? (
                <div className="col-sm-2">
                  {nn.isActive ? "Active" : "Inactive"}
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
