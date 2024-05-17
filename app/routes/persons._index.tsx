import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getAllPersons, getLikeNamePersons } from "~/controllers/persons";
import React, { useEffect } from "react";
import { isAuthenticated } from "~/services/auth.server";

import SecondaryNav from "~/components/secondarynav";
import NavBar from "~/components/nav";
import { PAGE_MARGIN } from "~/models/misc";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  // console.log("\n\n q:" + q);

  if (q == null) {
    const persons = await getAllPersons();
    return json({ currentUser, persons, q });
  } else {
    const persons = await getLikeNamePersons(q);
    return json({ currentUser, persons, q });
  }
};

export default function Persons() {
  const { currentUser, persons, q } = useLoaderData<typeof loader>();
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
        <h1>People</h1>
        <SecondaryNav
          target="persons"
          canDelete={false}
          canCreate={true}
          canEdit={false}
          canClone={false}
          viewLoginLog={false}
          viewDetail={false}
          showBack={true}
          showBackTitle="To Dashboard"
          backTarget={"dashboard"}
          what="Person"
        />
        <br />

        <Form
          id="search-form"
          role="search"
          onChange={(event) => submit(event.currentTarget)}
        >
          <input
            aria-label="Search people"
            defaultValue={q || ""}
            id="q"
            name="q"
            placeholder="Search"
            type="search"
          />
          {/* existing elements */}
        </Form>

        <nav className="nav flex-column">
          {persons.map((person) => (
            <li key={person.id}>
              <h5>
                <Link
                  to={`/persons/${person.id}`}
                  className="nav-link"
                  aria-current="page"
                >
                  {person.firstName + " " + person.lastName}
                </Link>
              </h5>
            </li>
          ))}
        </nav>
      </div>
    </>
  );
}
