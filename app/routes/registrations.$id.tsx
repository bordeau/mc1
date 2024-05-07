import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";
import PlainAddress from "~/components/plainaddress";

import { isAuthenticated } from "~/services/auth.server";
import { blankAddress } from "~/components/utils";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";
import { getRegistrationById } from "~/controllers/registrations";
import { Roles } from "~/models/role";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser.isLoggedIn) return redirect("/login");

  invariant(params.id, "Missing Registration ID param");

  const registration = await getRegistrationById(params.id);
  if (!registration) {
    throw new Response("Not Found", { status: 404 });
  }

  return { currentUser, registration };
};

export default function RegistrationDetail() {
  const { currentUser, registration } = useLoaderData<typeof loader>();

  let address = blankAddress("personal");

  if (registration.address != null) {
    // console.log("\n\n splitting before json " + JSON.stringify(tadd));

    address = JSON.parse(registration.address);

    // console.log("\n\n splitting address " + JSON.stringify(address));
  }

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  return (
    <>
      <Nav
        isAdmin={isAdmin}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <h1>Registration Detail</h1>
      <SecondaryNav
        target="registrations"
        id={registration.id}
        canDelete={true}
        canCreate={false}
        canEdit={true}
        canClone={false}
        canActivate={true}
        showBack={true}
        backTarget={"registrations"}
        showBackTitle="Back to List"
        what="Registration"
      />
      <br />

      <div className="row">
        <h6 className="col-2 align-text-top">Username:</h6>
        <p className="col-7 lead align-text-top">{registration.username}</p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Is Processed?</h6>
        <p className="col-7 lead align-text-top">
          {registration.isProcessed ? "Yes" : "No"}
        </p>
      </div>
      <div className="row">
        <h6 className="col-2 align-text-top">First Name:</h6>
        <p className="col-7 lead align-text-top">{registration.firstName}</p>
      </div>
      <div className="row">
        <h6 className="col-2 align-text-top">Last Name:</h6>
        <p className="col-7 lead align-text-top">{registration.lastName}</p>
      </div>
      <div className="row">
        <h6 className="col-2 align-text-top">Email:</h6>
        <p className="col-7 lead align-text-top">
          <a href={`mailto:` + registration.email}>{registration.email}</a>
        </p>
      </div>
      <div className="row">
        <h6 className="col-2 align-text-top">Phone:</h6>
        <p className="col-7 lead align-text-top">{registration.phone}</p>
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
    </>
  );
}
