import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { getAllRoles } from "~/controllers/roles";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getAllPersons, getLikeNamePersons } from "~/controllers/persons";
import React, { useEffect } from "react";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

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
    </>
  );
}
