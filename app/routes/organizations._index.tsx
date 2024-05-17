import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import React, { useEffect } from "react";
import { getAllOrgs, getLikeNameOrgs } from "~/controllers/orgs";
import NavBar from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import { isAuthenticated } from "~/services/auth.server";
import { PAGE_MARGIN } from "~/models/misc";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  // console.log("\n\n q:" + q);

  if (q == null) {
    const orgs = await getAllOrgs();

    return json({ currentUser, orgs, q });
  } else {
    const orgs = await getLikeNameOrgs(q);
    return json({ currentUser, orgs, q });
  }
};

export default function Organizations() {
  const { currentUser, orgs, q } = useLoaderData<typeof loader>();

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
        <h1>Organizations</h1>
        <SecondaryNav
          target="organizations"
          canDelete={false}
          canCreate={true}
          canEdit={false}
          canClone={false}
          viewLoginLog={false}
          viewDetail={false}
          showBack={true}
          backTarget={"dashboard"}
          showBackTitle="To Dashboard"
          showBack1={false}
          what="Organization"
        />
        <br />

        <Form
          id="search-form"
          role="search"
          onChange={(event) => submit(event.currentTarget)}
        >
          <input
            aria-label="Search organizations"
            defaultValue={q || ""}
            id="q"
            name="q"
            placeholder="Search"
            type="search"
          />
          {/* existing elements */}
        </Form>

        <nav className="nav flex-column">
          {orgs.map((org) => (
            <li key={org.id}>
              <h5>
                <Link
                  to={`/organizations/${org.id}`}
                  className="nav-link"
                  aria-current="page"
                >
                  {org.name}
                </Link>
              </h5>
            </li>
          ))}
        </nav>
      </div>
    </>
  );
}
