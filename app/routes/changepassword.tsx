import { Form, useLoaderData } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { isAuthenticated } from "~/services/auth.server";
import {
  getUserById,
  getUserByUsername,
  updateUserPassword,
} from "~/controllers/users";
import { sendEmail, EmailType } from "~/components/myresend";
import { useActionData } from "react-router";
import React from "react";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import bcrypt from "bcryptjs";
import { z } from "zod";
import SecondaryNav from "~/components/secondarynav";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser.isLoggedIn) return redirect("/login");

  return { currentUser };
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await Object.fromEntries(await request.formData());

  const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
  const schema = z.object({
    id: z.string(),
    currentPassword: z
      .string()
      .min(5, { message: "Current Password is required" }),
    newPassword: z
      .string()
      .regex(regex, { message: " Password must meet the requirements." }),
    repeatNewPassword: z
      .string()
      .min(5, { message: "Repeated New Password is required" }),
  });
  const validatedData = schema.safeParse(formData);

  if (validatedData.success == false) {
    console.log("\n\nreturning to previous");
    return { error: validatedData.error.format() };
  }

  const parsedData = validatedData.data;

  try {
    const userFromDB = await getUserById(parsedData.id);

    await bcrypt.compare(parsedData.currentPassword, userFromDB.password);

    console.log(
      "\n\n change password action userFromDB: " + JSON.stringify(userFromDB)
    );

    if (parsedData.newPassword === parsedData.repeatNewPassword) {
      const user = updateUserPassword(parsedData.id, parsedData.newPassword);

      return redirect(`/dashboard`);
    }
  } catch (e) {
    console.log("\n change password try catch error: " + JSON.stringify(e));
  }
}
/// current logged in user to change password
export default function ChangePassword() {
  const data = useActionData<typeof action>();
  const { currentUser } = useLoaderData<typeof loader>();
  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  return (
    <div class="container-md">
      <Nav
        isAdmin={isAdmin}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <h1>Change Password Request</h1>
      <SecondaryNav
        target="/"
        showBack={true}
        backTarget={"dashboard"}
        showBackTitle="Back to Dashboard"
      />
      <br />
      <Form key={currentUser.id} id="user-form" method="post">
        <input name="id" type="hidden" value={currentUser.id} />
        <p>
          Please enter your Username and Email. If there is a match, you will
          receive an email with a link to change your password.
        </p>

        <div className="row">
          <h6 className="col-2 align-text-top">
            <label htmlFor="username" className="form-label">
              Current Password:
            </label>
          </h6>
          <p className="col-7 lead align-text-top">
            <input
              name="currentPassword"
              type="password"
              placeholder=""
              className="form-control"
            />
            {data && data.error.currentPassword && (
              <p className="text-danger">
                {data.error.currentPassword._errors[0]}
              </p>
            )}
          </p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">
            <label htmlFor="newPassword" className="form-label">
              New Password:
            </label>
          </h6>
          <p className="col-7 lead align-text-top">
            <input
              name="newPassword"
              type="text"
              placeholder=""
              className="form-control"
            />
            {data && data.error.newPassword && (
              <p className="text-danger">{data.error.newPassword._errors[0]}</p>
            )}
          </p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">
            <label htmlFor="repeatNewPassword" className="form-label">
              Repeat New Password:
            </label>
          </h6>
          <p className="col-7 lead align-text-top">
            <input
              name="repeatNewPassword"
              type="text"
              placeholder=""
              className="form-control"
            />
            {data && data.error.repeatNewPassword && (
              <p className="text-danger">
                {data.error.repeatNewPassword._errors[0]}
              </p>
            )}
          </p>
        </div>
        <div className="card">
          <div className="card-body">
            <h3>Password Rules</h3>
            <ul className="list-group">
              <li className="list-group-item">5 or more characters</li>
              <li className="list-group-item">
                At least 1 of !@#$&* character
              </li>
              <li className="list-group-item">At least 1 number</li>
              <li className="list-group-item">At least 1 uppercase letter</li>
              <li className="list-group-item">At least 1 lowercase letter</li>
            </ul>
          </div>
        </div>

        <div className="mg-3">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button type="reset" className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
