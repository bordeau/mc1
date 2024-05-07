import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";
import FormAddress from "~/components/formaddress";

import { isAuthenticated } from "~/services/auth.server";
import { createUser, getUserById, updateUser } from "~/controllers/users";
import { blankAddress } from "~/components/utils";
import Nav from "~/components/nav";
import { Roles } from "~/models/role";
import { useActionData } from "react-router";
import React from "react";
import SecondaryNav from "~/components/secondarynav";
import { EmailType, sendEmail } from "~/components/myresend";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  return { currentUser };
};

export async function action({ request }: ActionFunctionArgs) {
  const formdata = Object.fromEntries(await request.formData());
  formdata.password = "password";
  const user = await createUser(formdata);

  const emailResult = await sendEmail({
    from: "onboarding@resend.dev",
    to: ["delivered@resend.dev"],
    subject: "Your NSF CRM account is activated",
    html:
      "Your account is activated, you can click this link to set your password. <a href='http://localhost:5173/resetpassword/" +
      user.id +
      "'>Set your Password.</a>",
  } as EmailType);

  console.log("\n\n clone result: " + JSON.stringify(user));

  if (user.hasOwnProperty("error")) return user;
  else return redirect(`/users/${user.id}`);
}

export default function UserCreate() {
  const { currentUser } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  let address = blankAddress("personal");

  address = blankAddress("personal");

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  if (!isAdmin) {
    console.log(
      "\n\n user: " + currentUser.username + " is trying to access users.create"
    );
    throw new Error("Sorry you do have access to this feature.");
  } else {
    return (
      <>
        <Nav
          isAdmin={isAdmin}
          isLoggedIn={isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />
        <h1>Create User</h1>

        <SecondaryNav
          target="users"
          id={""}
          canDelete={false}
          canCreate={false}
          canEdit={false}
          canClone={false}
          showBack={true}
          backTarget={"users"}
          what="User"
        />
        <br />
        <Form key={"creatuser"} id="createuser-form" method="post">
          <div className="row">
            <h6 className="col-2 align-text-top">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
            </h6>
            <p className="col-7 lead align-text-top">
              <input
                defaultValue=""
                name="username"
                type="text"
                placeholder="username"
                className="form-control"
              />
              {data && data.error.username && (
                <p className="text-danger">{data.error.username._errors[0]}</p>
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
              <select name="role" className="form-control" defaultValue="User">
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
                name="isActive"
                className="form-control"
                defaultValue="Yes"
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
                defaultValue=""
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
                defaultValue=""
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
                defaultValue=""
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
                defaultValue=""
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
      </>
    );
  }
}
