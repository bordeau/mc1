import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";
import FormAddress from "~/components/formaddress";

import { isAuthenticated } from "~/services/auth.server";
import { getUserById, updateUser } from "~/controllers/users";
import { blankAddress } from "~/components/utils";
import { Roles } from "~/models/role";
import { useActionData } from "react-router";
import React from "react";
import SecondaryNav from "~/components/secondarynav";
import NavBar from "~/components/nav";
import { PAGE_MARGIN } from "~/models/misc";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser.isLoggedIn) return redirect("/login");

  invariant(params.id, "Missing User ID param");

  const user = await getUserById(params.id);

  // console.log("\n\n useredit loader userid : " + params.id);
  // console.log("\n\n useredit loader user: " + JSON.stringify(user));

  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  return { currentUser, user };
};

export async function action({ request }: ActionFunctionArgs) {
  const formdata = Object.fromEntries(await request.formData());

  const user = await updateUser(formdata);

  console.log("\n\n update result: " + JSON.stringify(user));

  if (user.hasOwnProperty("error")) return user;
  else return redirect(`/users/${user.id}`);
}

export default function UserEdit() {
  const { currentUser, user } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  let address = blankAddress("personal");

  if (user.address != null) {
    // console.log("\n\n splitting before json " + JSON.stringify(tadd));

    address = JSON.parse(user.address);

    // console.log("\n\n splitting address " + JSON.stringify(address));
  }

  if (!Roles.isAdmin(currentUser.role)) {
    return (
      <>
        <NavBar
          role={currentUser.role}
          isLoggedIn={currentUser.isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />
        <div className={PAGE_MARGIN}>
          <h1>Edit Userl</h1>
          <p>You need to be an Administrator</p>
          <SecondaryNav
            target="registrations"
            id={registration.id}
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
          <h1>Edit User</h1>

          <SecondaryNav
            target="users"
            id={user.id}
            canDelete={user.id != currentUser.id ? true : false}
            canCreate={true}
            canEdit={false}
            canClone={true}
            showBack={true}
            backTarget={"users/" + user.id}
            showBackTitle="Back to User Detail"
            what="User"
          />
          <br />
          <Form key={user.id} id="user-form" method="post">
            <input name="id" type="hidden" value={user.id} />
            <div className="row">
              <h6 className="col-2 align-text-top">
                <label htmlFor="username" className="form-label">
                  Username:
                </label>
              </h6>
              <p className="col-7 lead align-text-top">
                <input
                  defaultValue={user.username}
                  name="username"
                  type="text"
                  placeholder="username"
                  className="form-control"
                />
                {data && data.error.username && (
                  <p className="text-danger">
                    {data.error.username._errors[0]}
                  </p>
                )}
              </p>
            </div>
            <div className="row">
              <h6 className="col-2 align-text-top">
                <label htmlFor="role" className="form-label">
                  Role:
                </label>
              </h6>
              <p className="col-7 lead align-text-top">
                <select
                  name="role"
                  className="form-control"
                  defaultValue={user.role}
                >
                  <option value="">Choose Role</option>
                  {Roles.validRoles.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>

                {data && data.error.role && (
                  <p className="text-danger">{data.error.role._errors[0]}</p>
                )}
              </p>
            </div>
            <div className="row">
              <h6 className="col-2 align-text-top">
                <label htmlFor="isActive" className="form-label">
                  Is Active?
                </label>
              </h6>
              <p className="col-7 lead align-text-top">
                <select
                  name="role"
                  className="form-control"
                  defaultValue={user.role ? "Yes" : "No"}
                >
                  <option value="">Choose Yes or No</option>

                  <option key="yes" value="Yes">
                    Yes
                  </option>
                  <option key="no" value="No">
                    No
                  </option>
                </select>
              </p>
            </div>
            <div className="row">
              <h6 className="col-2 align-text-top">
                <label htmlFor="firstName" className="form-label">
                  First Name:
                </label>
              </h6>
              <p className="col-7 lead align-text-top">
                <input
                  defaultValue={user.firstName}
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  className="form-control"
                />
                {data && data.error.firstName && (
                  <p className="text-danger">
                    {data.error.firstName._errors[0]}
                  </p>
                )}
              </p>
            </div>
            <div className="row">
              <h6 className="col-2 align-text-top">
                <label htmlFor="lastName" className="form-label">
                  Last Name:
                </label>
              </h6>
              <p className="col-7 lead align-text-top">
                <input
                  defaultValue={user.lastName}
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="form-control"
                />
                {data && data.error.lastName && (
                  <p className="text-danger">
                    {data.error.lastName._errors[0]}
                  </p>
                )}
              </p>
            </div>
            <div className="row">
              <h6 className="col-2 align-text-top">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
              </h6>
              <p className="col-7 lead align-text-top">
                <input
                  defaultValue={user.email}
                  name="email"
                  type="text"
                  placeholder="myemail@example.com"
                  className="form-control"
                />
                {data && data.error.email && (
                  <p className="text-danger">{data.error.email._errors[0]}</p>
                )}
              </p>
            </div>
            <div className="row">
              <h6 className="col-2 align-text-top">
                <label htmlFor="phone" className="form-label">
                  Phone:
                </label>
              </h6>
              <p className="col-7 lead align-text-top">
                <input
                  defaultValue={user.phone}
                  name="phone"
                  type="text"
                  placeholder=""
                  className="form-control"
                />
                {data && data.error.phone && (
                  <p className="text-danger">{data.error.phone._errors[0]}</p>
                )}
              </p>
            </div>
            <div className="accordion-body">
              <FormAddress
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
            <div className="mg-3">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button type="cancel" className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </Form>
        </div>
      </>
    );
  }
}
