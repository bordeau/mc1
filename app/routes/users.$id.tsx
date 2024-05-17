import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";
import PlainAddress from "~/components/plainaddress";

import { isAuthenticated } from "~/services/auth.server";
import { getUserById, getUserByIdWithLog } from "~/controllers/users";
import { blankAddress } from "~/components/utils";
import Nav from "~/components/nav";
import { Roles } from "~/models/role";
import SecondaryNav from "~/components/secondarynav";
import React from "react";
import NavBar from "~/components/nav";
import { PAGE_MARGIN } from "~/models/misc";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const url = new URL(request.url);
  let q = url.searchParams.get("log");

  invariant(params.id, "Missing User ID param");

  let user;
  if (q == "yes") user = await getUserByIdWithLog(params.id);
  else user = await getUserById(params.id);

  console.log("\n\n q: " + q + " user: " + JSON.stringify(user, null, 2));

  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  return { currentUser, user, q };
};

export default function UserDetail() {
  const { currentUser, user, q } = useLoaderData<typeof loader>();

  let address = blankAddress("personal");

  if (user.address != null) {
    // console.log("\n\n splitting before json " + JSON.stringify(tadd));

    address = JSON.parse(user.address);

    // console.log("\n\n splitting address " + JSON.stringify(address));
  }

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  let logs = [];
  if (user.hasOwnProperty("loginLog")) logs = user.loginLog;
  const logLength = logs.length;

  /*
  console.log(
    "\n\n logs: " +
      JSON.stringify(logs, null, 2) +
      " user: " +
      JSON.stringify(user, null, 2)
  );
*/

  if (!Roles.isAdmin(currentUser.role)) {
    return (
      <>
        <NavBar
          role={currentUser.role}
          isLoggedIn={currentUser.isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />
        <div className={PAGE_MARGIN}>
          <h1>User Detail</h1>
          <p>You need to be an Administrator</p>
          <SecondaryNav
            target="registrations"
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
          <h1>User Detail</h1>
          <SecondaryNav
            target="users"
            id={user.id}
            canDelete={user.id != currentUser.id ? true : false}
            canCreate={true}
            canEdit={true}
            canClone={true}
            viewLoginLog={q != "yes"}
            viewDetail={q == "yes"}
            showBack={true}
            backTarget={"users"}
            what="User"
          />
          <br />

          <div className="row">
            <h6 className="col-2 align-text-top">Username:</h6>
            <p className="col-7 lead align-text-top">{user.username}</p>
          </div>
          <div className="row">
            <h6 className="col-2 align-text-top">Role:</h6>
            <p className="col-7 lead align-text-top">{user.role}</p>
          </div>
          <div className="row">
            <h6 className="col-2 align-text-top">Is Active?</h6>
            <p className="col-7 lead align-text-top">
              {user.isActive ? "Yes" : "No"}
            </p>
          </div>
          <div className="row">
            <h6 className="col-2 align-text-top">First Name:</h6>
            <p className="col-7 lead align-text-top">{user.firstName}</p>
          </div>
          <div className="row">
            <h6 className="col-2 align-text-top">Last Name:</h6>
            <p className="col-7 lead align-text-top">{user.lastName}</p>
          </div>
          <div className="row">
            <h6 className="col-2 align-text-top">Email:</h6>
            <p className="col-7 lead align-text-top">
              <a href={`mailto:` + user.email}>{user.email}</a>
            </p>
          </div>
          <div className="row">
            <h6 className="col-2 align-text-top">Phone:</h6>
            <p className="col-7 lead align-text-top">{user.phone}</p>
          </div>
          <div className="accordion-body">
            <PlainAddress
              type="personal"
              typeLabel="Personal Address"
              street1={address.street1}
              street2={address.street2}
              city={address.city}
              state={address.state}
              country={address.country}
              zip={address.zip}
            />
          </div>

          {logLength ? (
            <div className="container-md">
              <div className="row">
                <div className="col lead">Name</div>
                <div className="col lead">Datetime</div>
              </div>
              {logs.map((ll) => (
                <div className="row">
                  <div className="col lead">{ll.status}</div>
                  <div className="col lead">
                    {new Date(ll.createdAt).toUTCString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }
}
