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
import {
  getRegistrationById, setIsProcessRegistration,
} from "~/controllers/registrations";
import PlainAddress from "~/components/plainaddress";
import { EmailType, sendEmail } from "~/components/myresend";

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

  const registration = await getRegistrationById(formdata.id);

  console.log("\n\n activate registeration: " + JSON.stringify(registration));

  const address = JSON.parse(registration.address);

  const data = {
    username: formdata.username,
    role: formdata.role,
    firstName: registration.firstName,
    lastName: registration.lastName,
    email: registration.email,
    phone: registration.phone,
    isActive: true,
    password: "blank",
    street1: address.street1,
    street2: address.street2,
    city: address.city,
    state: address.state,
    zip: address.zip,
    country: address.country,
    addressType: address.addressType,
  }

  console.log("\n\n activate user data: " + JSON.stringify(data));

  const user = await createUser(data);

  console.log("\n\n activate create user: " + JSON.stringify(user));

  if (user.hasOwnProperty("error")) return registration;
  else {

    await setIsProcessRegistration(registration.id, true );

    const emailResult = await sendEmail({
                                      from: "onboarding@resend.dev",
                                      to: ["delivered@resend.dev"],
                                      subject: "Your NSF CRM account is activated",
                                      html:
                                          "Your account is activated, you can click this link to set your password. <a href='http://localhost:5173/resetpassword/" +
                                          user.id + "'>Set your Password.</a>",
                                    } as EmailType);


    return redirect(`/users/${user.id}`); }
}

export default function RegistrationActivate() {
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
        <h1>Activate Registration (Create User)</h1>

        <SecondaryNav
          target="registrations"
          id={registration.id}
          canDelete={true}
          canCreate={false}
          canEdit={false}
          canClone={false}
          canActivate={false}
          showBack={true}
          backTarget={"registrations/" + registration.id}
          showBackTitle="Back to Registration Detail"
          what="Registration"

        />
        <br />
        <Form key = { registration.id } id = "user-form" method = "post">
          <input name = "id" type = "hidden" value = { registration.id } />
          <div className = "row">
            <h6 className = "col-2 align-text-top">
              <label htmlFor = "username" className = "form-label">
                Username:
              </label>
            </h6>
            <p className = "col-7 lead align-text-top">
              <input
                  defaultValue = { registration.username }
                  name = "username"
                  type = "text"
                  placeholder = "username"
                  className = "form-control"
              />
              { data && data.error.registration && (
                  <p className = "text-danger">
                    { data.error.registration._errors[0] }
                  </p>
              ) }
            </p>
          </div>




            <div className = "row">
              <h6 className = "col-2 align-text-top">Is Processed?</h6>
              <p className = "col-7 lead align-text-top">{ registration.isProcessed ? "Yes" : "No" }</p>
            </div>


            <div className = "row">
              <h6 className = "col-2 align-text-top">
                <label htmlFor = "role" className = "form-label">
                  Role:
                </label>
              </h6>

              <p className = "col-7 lead align-text-top">
                <select
                    name = "role"
                    className = "form-control"
                    defaultValue = "User"
                    Required: true
                >
                  <option value = "">Choose Role</option>
                  { Roles.validRoles.map( ( o ) => (
                      <option key = { o } value = { o }>
                        { o }
                      </option>
                  ) ) }
                </select>

                { data && data.error.role && (
                    <p className = "text-danger">{ data.error.role._errors[0] }</p>
                ) }
              </p>
            </div>

            <div className = "row">
              <h6 className = "col-2 align-text-top">First Name:</h6>
              <p className = "col-7 lead align-text-top">{ registration.firstName }</p>
            </div>
            <div className = "row">
              <h6 className = "col-2 align-text-top">Last Name:</h6>
              <p className = "col-7 lead align-text-top">{ registration.lastName }</p>
            </div>
            <div className = "row">
              <h6 className = "col-2 align-text-top">Email:</h6>
              <p className = "col-7 lead align-text-top">
                <a href = { `mailto:` + registration.email }>{ registration.email }</a>
              </p>
            </div>
            <div className = "row">
              <h6 className = "col-2 align-text-top">Phone:</h6>
              <p className = "col-7 lead align-text-top">{ registration.phone }</p>
            </div>
            <div className = "accordion-body">
              <PlainAddress
                  type = "personal"
                  typeLabel = "Personal Address"
                  street1 = { address.street1 }
                  street2 = { address.street2 }
                  city = { address.city }
                  state = { address.state }
                  country = { address.country }
                  zip = { address.zip }
              />
            </div>
            <div className = "mg-3">
              <button type = "submit" className = "btn btn-primary">
                Activate
              </button>
              <button type = "reset" className = "btn btn-secondary">
                Cancel
              </button>
            </div>
        </Form>
      </div>
  );
  }
  else {
    return (
        <>
          <p>You're not an Admin and therefore do not have access.</p>
        </>
    );
  }
  }

