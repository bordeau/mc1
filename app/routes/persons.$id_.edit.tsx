import {
  type ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";

import invariant from "tiny-invariant";

import { z } from "zod";

import {
  getAllPersonUsers,
  getPersonById,
  updatePerson,
} from "~/controllers/persons";
import FormAddress from "~/components/formaddress";
import { useActionData } from "react-router";

import React from "react";
import { isAuthenticated } from "~/services/auth.server";
import { blankAddress } from "~/components/utils";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing Person ID param");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const [person, ownerPersons] = await Promise.all([
    getPersonById(params.id),
    getAllPersonUsers(),
  ]);

  // console.log("\n\nperson loader:" + JSON.stringify(person));
  if (!person) {
    throw new Response("Not Found", { status: 404 });
  }
  return { currentUser, person, ownerPersons };
};

export async function action({ request }: ActionFunctionArgs) {
  const formdata = Object.fromEntries(await request.formData());

  const person = await updatePerson(formdata);

  console.log("\n\n update result: " + JSON.stringify(person));

  if (person.hasOwnProperty("error")) return person;
  else return redirect(`/persons/${person.id}`);
}

export default function PersonEdit() {
  const { currentUser, person, ownerPersons, myUserProfile } =
    useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  const navigate = useNavigate();

  let address = blankAddress("personal");
  if (person.address != null) {
    // console.log("\n\n splitting before json " + JSON.stringify(tadd));

    address = JSON.parse(person.address);

    // console.log("\n\n splitting address " + JSON.stringify(address));
  }

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isManager = Roles.isManager(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  return (
    <div className="container-md">
      <Nav
        isAdmin={isAdmin}
        isManager={isManager}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <h1>User Detail</h1>
      <SecondaryNav
        target="persons"
        id={person.id}
        canDelete={false}
        canCreate={true}
        canEdit={true}
        canClone={true}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={"persons"}
        what="Person"
      />
      <br />
      <h1>Edit Person</h1>

      <Form key={person.id} id="person-form" method="post">
        <input type="hidden" name="id" value={person.id} />
        <div className="mg-3">
          <label htmlFor="firstName" className="form-label">
            First Name:
          </label>

          <input
            defaultValue={person.firstName}
            name="firstName"
            type="text"
            placeholder="First Name"
            className="form-control"
          />
          {data && data.error.firstName && (
            <p className="text-danger">{data.error.firstName._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="lastName" className="form-label">
            Last Name:
          </label>

          <input
            defaultValue={person.lastName}
            name="lastName"
            type="text"
            placeholder="Last Name"
            className="form-control"
          />
          {data && data.error.lastName && (
            <p className="text-danger">{data.error.lastName._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>

          <input
            defaultValue={person.email}
            name="email"
            type="text"
            placeholder="Email"
            className="form-control"
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
            defaultValue={person.phone}
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
            defaultValue={person.description}
            name="description"
            type="text"
            placeholder="Description"
            className="form-control"
          />
          {data && data.error.description && (
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
          <label htmlFor="ownerId" className="form-label">
            Owner:
          </label>

          {person.ownerId === myUserProfile.id ? (
            <select
              name="ownerId"
              className="form-control"
              defaultValue={person.ownerId}
            >
              <option value="">Choose Owner</option>
              {ownerPersons.map((o) => (
                <option key={o.userId} value={o.userId}>
                  {o.lastName}, {o.firstName}
                </option>
              ))}
            </select>
          ) : (
            <p className="lead">
              {person.owner.personOwners[0].firstName +
                " " +
                person.owner.personOwners[0].lastName}
            </p>
          )}
          {data && data.error.ownerId && (
            <p className="text-danger">{data.error.ownerId._errors[0]}</p>
          )}
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
  );
}
