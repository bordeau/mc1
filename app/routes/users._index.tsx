import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  getAllUsers,
  getAllUsersByIsActive,
  getAllUsersByRole,
  getAllUsersByRoleIsActive,
  getLikeNameIsActiveUsers,
  getLikeNameRoleIsActiveUsers,
  getLikeNameRoleUsers,
  getLikeNameUsers,
} from "~/controllers/users";
import React, { useEffect } from "react";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import SecondaryNav from "~/components/secondarynav";
import NavBar from "~/components/nav";
import { PAGE_MARGIN } from "~/models/misc";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const url = new URL(request.url);
  let q = url.searchParams.get("q");
  let r = url.searchParams.get("r");
  let a = url.searchParams.get("a");

  if (q == "") q = null;
  if (r == "") r = null;
  if (a == "" || a == null) a = "a";

  // console.log("\n\n q:" + q + "  r: " + r + "  a: " + a);

  // no name string, no role, active=all
  if (q == null && r == null && a == "all") {
    const users = await getAllUsers();
    return json({ currentUser, users, q, a, r });
  }

  // no name string, no role, active=active or initial value
  else if (q == null && r == null && (a == "ac" || a == null)) {
    const users = await getAllUsersByIsActive(true);
    return json({ currentUser, users, q, a, r });
  }

  // no name string, no role, active=inactive
  else if (q == null && r == null && a == "in") {
    const users = await getAllUsersByIsActive(false);
    return json({ currentUser, users, q, a, r });
  }

  // no name string, has role, active=active or initial value
  else if (q == null && r != null && (a == "ac" || a == null)) {
    const users = await getAllUsersByRoleIsActive(r, true);
    return json({ currentUser, users, q, a, r });
  }

  // no name string, has role, active=inactive
  else if (q == null && r != null && a == "in") {
    const users = await getAllUsersByRoleIsActive(r, false);
    return json({ currentUser, users, q, a, r });
  }

  // no name string, has role, active=all
  else if (q == null && r != null && a == "all") {
    const users = await getAllUsersByRole(r);
    return json({ currentUser, users, q, a, r });
  }

  // has name string, no role, active=active or initial value
  else if (q != null && r == null && (a == "ac" || a == null)) {
    const users = await getLikeNameIsActiveUsers(q, true);
    return json({ currentUser, users, q, a, r });
  }

  // has name string, no role, active=inactive
  else if (q != null && r == null && a == "in") {
    const users = await getLikeNameIsActiveUsers(q, false);
    return json({ currentUser, users, q, a, r });
  }

  // has name string, no role, active=all
  else if (q != null && r == null && a == "all") {
    const users = await getLikeNameUsers(q);
    return json({ currentUser, users, q, a, r });
  }

  // has name string, has role, active=active or initial value
  else if (q != null && r != null && (a == "ac" || a == null)) {
    const users = await getLikeNameRoleIsActiveUsers(q, r, true);
    return json({ currentUser, users, q, a, r });
  }

  // has name string, no role, active=inactive
  else if (q != null && r != null && a == "in") {
    const users = await getLikeNameRoleIsActiveUsers(q, r, false);
    return json({ currentUser, users, q, a, r });
  }

  // has name string, no role, active=all
  else if (q != null && r != null && a == "all") {
    const users = await getLikeNameRoleUsers(q, r);
    return json({ currentUser, users, q, a, r });
  }

  //
  else {
    const users = await getAllUsersByIsActive(true);
    return json({ currentUser, users, q, a, r });
  }
};

export default function Users() {
  const { currentUser, users, q, a, r } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  if (!Roles.isAdmin(currentUser.role)) {
    return (
      <>
        <NavBar
          role={currentUser.role}
          isLoggedIn={currentUser.isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />
        <div className={PAGE_MARGIN}>
          <h1>Users</h1>
          <p>You need to be an Administrator</p>
          <SecondaryNav
            canDelete={false}
            canCreate={false}
            canEdit={false}
            canClone={false}
            canActivate={false}
            showBack={true}
            backTarget={"dashboard"}
            showBackTitle="To Dashboard"
            what="Registration"
          />
          <br />
        </div>
      </>
    );
  }
  //
  else {
    return (
      <>
        <NavBar
          role={currentUser.role}
          isLoggedIn={currentUser.isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />
        <div className={PAGE_MARGIN}>
          <h1>Users</h1>

          <SecondaryNav
            target="users"
            id={""}
            canDelete={false}
            canCreate={true}
            canEdit={false}
            canClone={false}
            showBack={true}
            backTarget={"dashboard"}
            showBackTitle="To Dashboard"
            what="User"
          />
          <div className="border">
            <h5>Filter</h5>
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
              &nbsp;
              <input
                className="form-check-input"
                type="radio"
                name="a"
                value="ac"
                id="ac"
                defaultChecked={a == "ac"}
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Show Active
              </label>
              <input
                className="form-check-input"
                type="radio"
                name="a"
                id="in"
                value="in"
                defaultChecked={a == "in"}
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Show Inactive
              </label>
              <input
                className="form-check-input"
                type="radio"
                name="a"
                id="all"
                value="all"
                defaultChecked={a == "all"}
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Show All
              </label>
              &nbsp;
              <select name="r" defaultValue="">
                <option value="">Choose Role (Leave empty for Any)</option>
                {Roles.validRoles.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              &nbsp;
              <button className="btn btn-primary btn-sm" type="reset">
                Reset Search
              </button>
              {/* existing elements */}
            </Form>
          </div>

          <br />

          <div>
            <div className="row">
              <div className="col lead">Name</div>
              <div className="col lead">Is Active</div>
              <div className="col lead">Role</div>
            </div>
            {users.map((u) => (
              <div className="row" key={u.id}>
                <div className="col">
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
        </div>
      </>
    );
  }
}
