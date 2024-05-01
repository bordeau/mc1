import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";
import PlainAddress from "~/components/plainaddress";

import { isAuthenticated } from "~/services/auth.server";
import { getUserById } from "~/controllers/users";
import { blankAddress } from "~/components/utils";
import Nav from "~/components/nav";
import { Roles } from "~/models/role";
import SecondaryNav from "~/components/secondarynav";
import React from "react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  invariant(params.id, "Missing User ID param");

  const user = await getUserById(params.id);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  return { currentUser, user };
};

export default function UserDetail() {
  const { currentUser, user } = useLoaderData<typeof loader>();

  let address = blankAddress("personal");

  if (user.address != null) {
    // console.log("\n\n splitting before json " + JSON.stringify(tadd));

    address = JSON.parse(user.address);

    // console.log("\n\n splitting address " + JSON.stringify(address));
  }

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  return (
    <div className="container-md">
      <Nav
        isAdmin={isAdmin}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <h1>User Detail</h1>
      <SecondaryNav
        target="users"
        id={user.id}
        canDelete={user.id != currentUser.id ? true : false}
        canCreate={true}
        canEdit={true}
        canClone={true}
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
    </div>
  );
}
