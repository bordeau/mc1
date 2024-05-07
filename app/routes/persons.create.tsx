import {
  type ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";

import { createPerson } from "~/controllers/persons";
import FormAddress from "~/components/formaddress";
import { useActionData } from "react-router";
import React from "react";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import { isAuthenticated } from "~/services/auth.server";
import { blankAddress } from "~/components/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  return json({ currentUser });
};

export async function action({ request }: ActionFunctionArgs) {
  const formdata = Object.fromEntries(await request.formData());

  console.log("\n\nperson create formdata?: " + JSON.stringify(formdata));

  const person = await createPerson(formdata);

  console.log("\n\n create result: " + JSON.stringify(person));

  if (person.hasOwnProperty("error")) return person;
  else return redirect(`/persons/${person.id}`);
}

export default function PersonCreate() {
  const data = useActionData<typeof action>();
  const navigate = useNavigate();
  const { currentUser } = useLoaderData<typeof loader>();

  const address = blankAddress("personal");

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
      <h1>Create Person</h1>
      <SecondaryNav
        target="persons"
        canDelete={false}
        canCreate={false}
        canEdit={false}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={"persons"}
        what="Person"
      />
      <br />
      <div className="container-md">
        <Form key="personcreate" id="person-form" method="post">
          <input name="ownerId" type="hidden" value={currentUser.id} />
          <input name="isActive" type="hidden" value="true" />
          <div className="mg-3">
            <label htmlFor="firstName" className="form-label">
              First Name:
            </label>

            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              className="form-control"
              required={true}
            />
            {data && data.error.firstName && (
              <p className="text-danger">{data.error.first_name._errors[0]}</p>
            )}
          </div>

          <div className="mg-3">
            <label htmlFor="lastName" className="form-label">
              Last Name:
            </label>

            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="form-control"
              required={true}
            />
            {data && data.error.lastName && (
              <p className="text-danger">{data.error.last_name._errors[0]}</p>
            )}
          </div>

          <div className="mg-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>

            <input
              name="email"
              type="text"
              placeholder="Email"
              className="form-control"
              required={true}
            />
            {data && data.error.email && (
              <p className="text-danger">{data.error.email._errors[0]}</p>
            )}
          </div>

          <div className="mg-3">
            <label htmlFor="phone" className="form-label">
              Phone:
            </label>

            <input
              name="phone"
              type="text"
              placeholder="Phone"
              className="form-control"
            />
            {data && data.error.phone && (
              <p className="text-danger">{data.error.phone._errors[0]}</p>
            )}
          </div>

          <div className="mg-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>

            <textarea
              name="description"
              type="text"
              placeholder="Description"
              className="form-control"
            />
            {data && data.description.website && (
              <p className="text-danger">{data.error.description._errors[0]}</p>
            )}
          </div>

          <div className="mg-3">
            <FormAddress
              type="personal"
              typeLabel="Personal Address"
              street1={address.street1}
              street2={address.street2}
              city={address.city}
              state={address.state}
              country={address.country}
              zip={address.zip}
              data={data}
            />
          </div>

          <div className="mg-3">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              type="button"
            >
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
