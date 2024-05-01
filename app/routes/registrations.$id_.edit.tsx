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
import Nav from "~/components/nav";
import { Roles } from "~/models/role";
import { useActionData } from "react-router";
import React from "react";
import SecondaryNav from "~/components/secondarynav";
import {
  getRegistrationById,
  updateRegistration,
} from "~/controllers/registrations";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser.isLoggedIn) return redirect("/login");

  invariant(params.id, "Missing Registration ID param");

  const registration = await getRegistrationById(params.id);

  // console.log("\n\n useredit loader userid : " + params.id);
  // console.log("\n\n useredit loader user: " + JSON.stringify(user));

  if (!registration) {
    throw new Response("Not Found", { status: 404 });
  }

  return { currentUser, registration };
};

export async function action({ request }: ActionFunctionArgs) {
  const formdata = Object.fromEntries(await request.formData());

  const registration = await updateRegistration(formdata);

  console.log("\n\n update result: " + JSON.stringify(registration));

  if (registration.hasOwnProperty("error")) return registration;
  else return redirect(`/registrations/${registration.id}`);
}

export default function RegistrationEdit() {
  const { currentUser, registration } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  let address = blankAddress("personal");

  if (registration.address != null) {
    // console.log("\n\n splitting before json " + JSON.stringify(tadd));

    address = JSON.parse(registration.address);

    // console.log("\n\n splitting address " + JSON.stringify(address));
  }

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  if (isAdmin) {
    return (
      <div className="container-md">
        <Nav
          isAdmin={isAdmin}
          isLoggedIn={isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />
        <h1>Edit User</h1>

        <SecondaryNav
          target="registrations"
          id={registration.id}
          canDelete={true}
          canCreate={false}
          canEdit={false}
          canClone={false}
          showBack={true}
          backTarget={"registrations/" + registration.id}
          showBackTitle="Back to Registration Detail"
          what="Registration"
        />
        <br />
        <Form key={registration.id} id="user-form" method="post">
          <input name="id" type="hidden" value={registration.id} />
          <div className="row">
            <h6 className="col-2 align-text-top">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
            </h6>
            <p className="col-7 lead align-text-top">
              <input
                defaultValue={registration.username}
                name="username"
                type="text"
                placeholder="username"
                className="form-control"
              />
              {data && data.error.registration && (
                <p className="text-danger">
                  {data.error.registration._errors[0]}
                </p>
              )}
            </p>
          </div>

          <div className="row">
            <h6 className="col-2 align-text-top">
              <label htmlFor="isProcessed" className="form-label">
                Is Processed?
              </label>
            </h6>
            <p className="col-7 lead align-text-top">
              <select
                name="isProcessed"
                className="form-control"
                defaultValue={registration.isProcessed ? "Yes" : "No"}
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
                defaultValue={registration.firstName}
                name="firstName"
                type="text"
                placeholder="First Name"
                className="form-control"
              />
              {data && data.error.firstName && (
                <p className="text-danger">{data.error.firstName._errors[0]}</p>
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
                defaultValue={registration.lastName}
                name="lastName"
                type="text"
                placeholder="Last Name"
                className="form-control"
              />
              {data && data.error.lastName && (
                <p className="text-danger">{data.error.lastName._errors[0]}</p>
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
                defaultValue={registration.email}
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
                defaultValue={registration.phone}
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
    );
  } else {
    return (
      <>
        <p>You're not an Admin and therefore do not have access.</p>
      </>
    );
  }
}

/*

  <nav className="navbar navbar-expand-lg navbar-light bg-light border border-primary rounded-1 ">
          <nav className="nav flex-sm">
            <Link
              to={`/users/` + user.id + `/edit`}
              className="nav-link"
              aria-current="page"
            >
              Edit
            </Link>
            {!user.id ? (
              <Link
                to={`/users/` + user.id + `/destroy`}
                className="nav-link"
                aria-current="page"
              >
                Delete
              </Link>
            ) : (
              " "
            )}

            <Link to={`/users`} className="nav-link" aria-current="page">
              Back to list
            </Link>
          </nav>
        </nav>
 */
