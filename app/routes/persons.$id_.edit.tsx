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
import { getAllUsers } from "~/controllers/users";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing  ID param");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const [person, users] = await Promise.all([
    getPersonById(params.id),
    getAllUsers(),
  ]);

  // console.log("\n\nperson loader:" + JSON.stringify(person));
  if (!person) {
    throw new Response("Not Found", { status: 404 });
  }
  return { currentUser, person, users };
};

export async function action({ request }: ActionFunctionArgs) {
  const formdata = Object.fromEntries(await request.formData());

  const person = await updatePerson(formdata);

  console.log("\n\n update result: " + JSON.stringify(person));

  if (person.hasOwnProperty("error")) return person;
  else return redirect(`/persons/${person.id}`);
}

export default function PersonEdit() {
  const { currentUser, person, users } = useLoaderData<typeof loader>();
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
    <>
      <Nav
        isAdmin={isAdmin}
        isManager={isManager}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <h1>Edit Person</h1>
      <SecondaryNav
        target="persons"
        id={person.id}
        canDelete={false}
        canCreate={true}
        canEdit={false}
        canClone={true}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={"persons/" + person.id}
        showBackTitle="Back to Person Detail"
        what="Person"
      />
      <br />

      <Form key={person.id} id="person-form" method="post">
        <input type="hidden" name="id" value={person.id} />

        <div className="row">
          <div className="col-2 align-text-top">
            <label htmlFor="firstName" className="form-label">
              First Name:
            </label>
          </div>
          <div className="col-9 lead align-text-top">
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
        </div>

        <div className="row">
          <div className="col-2 align-text-top">
            <label htmlFor="lastName" className="form-label">
              Last Name:
            </label>
          </div>
          <div className="col-9 lead align-text-top">
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
        </div>

        <div className="row">
          <div className="col-2 align-text-top">
            <label htmlFor="isActive" className="form-label">
              Active?
            </label>
          </div>
          <div className="col-9 lead align-text-top">
            <select
              name="isActive"
              className="form-control"
              defaultValue={person.isActive ? "yes" : ""}
            >
              <option key="yes" value="yes">
                Yes
              </option>
              <option key="no" value="">
                No
              </option>
            </select>
            {data && data.error.isActive && (
              <p className="text-danger">{data.error.isActive._errors[0]}</p>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-2 align-text-top">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
          </div>
          <div className="col-9 lead align-text-top">
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
        </div>

        <div className="row">
          <div className="col-2 align-text-top">
            <label htmlFor="phone" className="form-label">
              Phone:
            </label>
          </div>
          <div className="col-9 lead align-text-top">
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
        </div>

        <div className="row">
          <div className="col-2 align-text-top">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
          </div>
          <div className="col-9 lead align-text-top">
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
            data={data}
          />
        </div>

        <div className="border border-primary border-2 gx-10">
          <label htmlFor="ownerId" className="form-label">
            Owner
          </label>

          {person.ownerId === currentUser.id ? (
            <select
              name="ownerId"
              className="form-control"
              defaultValue={person.ownerId}
            >
              <option value="">Choose Owner</option>
              {users.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.lastName}, {o.firstName}
                </option>
              ))}
            </select>
          ) : (
            <span className="lead">
              &nbsp;&nbsp;---&nbsp;&nbsp;
              {person.owner.firstName + " " + person.owner.lastName}
            </span>
          )}
          {data && data.error.ownerId && (
            <p className="text-danger">{data.error.ownerId._errors[0]}</p>
          )}
        </div>
        <br />
        <div className="mg-3">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button type="reset" className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </Form>
    </>
  );
}
