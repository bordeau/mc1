import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getAllUsers, getLikeNameUsers } from "~/controllers/users";
import React, { useEffect } from "react";
import { isAuthenticated } from "~/services/auth.server";
import Nav from "~/components/nav";
import { Roles } from "~/models/role";
import SecondaryNav from "~/components/secondarynav";
import {
  getAllInProcessingRegistrations,
  getAllRegistrations,
  getLikeNameIsProcessedRegistrations,
  getLikeNameNotIsProcessedRegistrations,
  getLikeNameRegistrations,
} from "~/controllers/registrations";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser.isLoggedIn) return redirect("/login");

  const url = new URL(request.url);
  let q = url.searchParams.get("q");
  let p = url.searchParams.get("p");
  const pp: boolean = p == "p" || p == "" || p == null;

  if (q == "") q = null;
  if (p == "" || p == null) p = "p";

  // console.log("\n\n q:" + q);
  //console.log("\n\n p:" + p + " pp:" + (pp ? "YES" : "NO"));

  if (q != null && p == "p") {
    const registrations = await getLikeNameIsProcessedRegistrations(q);
    return json({ currentUser, registrations, q, p, pp });
  }
  //
  else if (q != null && p == "a") {
    const registrations = await getLikeNameRegistrations(q);
    return json({ currentUser, registrations, q, p, pp });
  }
  //
  else if (q == null && p == "p") {
    const registrations = await getAllInProcessingRegistrations();
    return json({ currentUser, registrations, q, p, pp });
  }
  //
  else {
    const registrations = await getAllRegistrations();
    return json({ currentUser, registrations, q, p, pp });
  }
};

export default function Registrations() {
  const { currentUser, registrations, q, p, pp } =
    useLoaderData<typeof loader>();
  const submit = useSubmit();
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  // console.log("\n\n AFTER p:" + p + " pp:" + (pp ? "YES" : "NO"));

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
      <div className="container border">
        <h5>Filter</h5>
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

          <input
            className="form-check-input"
            type="radio"
            name="p"
            value="p"
            id="on"
            defaultChecked={pp}
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Show Pending
          </label>
          <input
            className="form-check-input"
            type="radio"
            name="p"
            id="off"
            value="a"
            defaultChecked={!pp}
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Show All
          </label>

          {/* existing elements */}
        </Form>
      </div>
      <br />

      <div className="container">
        <div className="row">
          <div className="col lead">Name</div>
          <div className="col lead">
            Is Pending {!pp ? "/User Created" : ""}
          </div>
        </div>

        {registrations.map((u) => (
          <div className="row" key={u.id}>
            <div className="col">
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
            <div className="col">
              {u.isProcessed ? "User Created" : "Pending"}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
