import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { destroyPerson, getPersonById } from "~/controllers/persons";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import React from "react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  invariant(params.id, "Missing id param");

  const person = await getPersonById(params.id);

  return { currentUser, person };
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  console.log("\n\n delete form data: " + JSON.stringify(formData));
  const id = formData.id;

  if (formData.button === "yes" && formData.userId === "") {
    console.log("\n\ndeleted personId:" + id + "\n\n");
    await destroyPerson(Number(id));
    return redirect("/persons");
  }

  if (formData.button === "yes" && formData.userId != "") {
    console.log(
      "\n\ncannot delete personId:" + id + " because has login credential.\n\n"
    );
  }

  return redirect("/persons/" + id);
}

export default function DestroyPerson() {
  const { currentUser, person } = useLoaderData<typeof loader>();

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
      <h1>User Detail</h1>
      <SecondaryNav
        target="persons"
        id={person.id}
        canDelete={false}
        canCreate={true}
        canEdit={false}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={"persons"}
        what="Person"
      />
      <br />

      <Form key="persondelete" id="persondelete-form" method="post">
        <input type="hidden" name="id" value={person.id} />

        <div className="mg-3">
          <label className="form-label">
            Are you sure you want to delete person:{" "}
            {person.firstName + " " + person.lastName}?
          </label>
        </div>
        <div className="mg-3">
          <button
            type="submit"
            className="btn btn-primary"
            name="button"
            value="yes"
          >
            Yes
          </button>
          <button
            type="submit"
            className="btn btn-secondary"
            name="button"
            value="no"
          >
            No
          </button>
        </div>
      </Form>
    </>
  );
}
