import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import React, { useEffect } from "react";
import { getAllOrgs, getLikeNameOrgs } from "~/controllers/orgs";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import { Roles } from "~/models/role";
import { isAuthenticated } from "~/services/auth.server";
import { getAllOpps, getLikeNameOpps } from "~/controllers/opps";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  // console.log("\n\n q:" + q);

  if (q == null) {
    const list = await getAllOpps();

    return json({ currentUser, list, q });
  } else {
    const list = await getLikeNameOpps(q);
    return json({ currentUser, list, q });
  }
};

export default function Opportunities_index() {
  const { currentUser, list, q } = useLoaderData<typeof loader>();

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  const submit = useSubmit();
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <>
      <Nav
        isAdmin={isAdmin}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <h1>Opportunties</h1>
      <SecondaryNav
        target="opportunities"
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
        {/* existing elements */}
      </Form>

      <nav className="nav flex-column">
        {list.map((nn) => (
          <li key={nn.id}>
            <h5>
              <Link
                to={`/opportunities/${nn.id}`}
                className="nav-link"
                aria-current="page"
              >
                {nn.name}
              </Link>
            </h5>
          </li>
        ))}
      </nav>
    </>
  );
}
