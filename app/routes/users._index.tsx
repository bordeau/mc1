import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getAllUsers, getLikeNameUsers } from "~/controllers/users";
import React, { useEffect } from "react";
import { isAuthenticated } from "~/services/auth.server";
import Nav from "~/components/nav";
import { Roles } from "~/models/role";
import SecondaryNav from "~/components/secondarynav";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  // console.log("\n\n q:" + q);

  if (q == null) {
    const users = await getAllUsers();
    return json({ currentUser, users, q });
  } else {
    const users = await getLikeNameUsers(q);
    return json({ currentUser, users, q });
  }
};

export default function Users() {
  const { currentUser, users, q } = useLoaderData<typeof loader>();
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
        <h1>Users</h1>
      </div>

      <SecondaryNav
        target="users"
        id={""}
        canDelete={false}
        canCreate={true}
        canEdit={false}
        canClone={false}
        showBack={false}
        backTarget={""}
        what="User"
      />

      <Form
        id="search-form"
        role="search"
        onChange={(event) => submit(event.currentTarget)}
      >
        <input
          aria-label="Search users"
          defaultValue={q || ""}
          id="q"
          name="q"
          placeholder="Search"
          type="search"
        />
        {/* existing elements */}
      </Form>

      <div className="container">
        <div className="row">
          <div className="col lead">Name</div>
          <div className="col lead">Is Active</div>
          <div className="col lead">Role</div>
        </div>
        {users.map((u) => (
          <div className="row">
            <div className="col" key={u.id}>
              <Link
                to={`/users/${u.id}`}
                className="nav-link"
                aria-current="page"
              >
                {u.firstName + " " + u.lastName}
              </Link>
            </div>
            <div className="col">{u.isActive ? "Active" : "Inactive"}</div>
            <div className="col">{u.role}</div>
          </div>
        ))}
      </div>
    </>
  );
}
