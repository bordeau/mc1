import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getAllUsers, getLikeNameUsers } from "~/controllers/users";
import React, { useEffect } from "react";
import { isAuthenticated } from "~/services/auth.server";
import Nav from "~/components/nav";
import { Roles } from "~/models/role";
import SecondaryNav from "~/components/secondarynav";
import {
  getAllRegistrations,
  getLikeNameRegistrations,
} from "~/controllers/registrations";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser.isLoggedIn) return redirect("/login");

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  // console.log("\n\n q:" + q);

  if (q == null) {
    const registrations = await getAllRegistrations();
    return json({ currentUser, registrations, q });
  } else {
    const registrations = await getLikeNameRegistrations(q);
    return json({ currentUser, registrations, q });
  }
};

export default function Registrations() {
  const { currentUser, registrations, q } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  return (
    <>
      <Nav
        isAdmin={isAdmin}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <div>
        <h1>Registrations</h1>
      </div>

      <SecondaryNav
        target="registrations"
        id={""}
        canDelete={false}
        canCreate={false}
        canEdit={false}
        canClone={false}
        showBack={true}
        backTarget={""}
        what="Registration"
      />

      <Form
        id="search-form"
        role="search"
        onChange={(event) => submit(event.currentTarget)}
      >
        <input
          aria-label="Search registrations"
          defaultValue={q || ""}
          id="q"
          name="q"
          placeholder="Search"
          type="search"
        />
        {/* existing elements */}
      </Form>

      <div className="container">
        {registrations.map((u) => (
          <div class="row">
            <div class="col" key={u.id}>
              {!u.isProcessed ? (
                <Link
                  to={`/registrations/${u.id}`}
                  className="nav-link"
                  aria-current="page"
                >
                  {u.firstName + " " + u.lastName}
                </Link>
              ) : (
                u.firstName + " " + u.lastName
              )}
            </div>
            <div class="col">{u.isProcessed ? "User Created" : "Pending"}</div>
          </div>
        ))}
      </div>
    </>
  );
}
