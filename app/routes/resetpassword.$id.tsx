import { Form, useLoaderData } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { isAuthenticated } from "~/services/auth.server";
import { getUserById, updateUserPassword } from "~/controllers/users";
import { sendEmail, EmailType } from "~/components/myresend";
import { useActionData } from "react-router";
import React from "react";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import bcrypt from "bcryptjs";
import { z } from "zod";
import invariant from "tiny-invariant";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing User ID param");

  let user = undefined;
  try {
    user = await getUserById(params.id);
  } catch (e) {
    console.log("\n\n forgot password didn't find user");
    throw new Error("Bad Request");
  }
  return { user };
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await Object.fromEntries(await request.formData());

  const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
  const schema = z.object({
    id: z.string(),
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

    console.log(
      "\n\n change password action userFromDB: " + JSON.stringify(userFromDB)
    );

    if (parsedData.newPassword === parsedData.repeatNewPassword) {
      const user = updateUserPassword(parsedData.id, parsedData.newPassword);

      return redirect(`/login`);
    }
  } catch (e) {
    console.log("\n change password try catch error: " + JSON.stringify(e));
  }
}
/// used to reset password via email
export default function ForgotPassword() {
  const data = useActionData<typeof action>();
  const { user } = useLoaderData<typeof loader>();

  return (
    <div class="container-md">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="about">
            NSF CRM
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
      <h1>Create New Password</h1>
      <Form key={user.id} id="user-form" method="post">
        <input name="id" type="hidden" value={user.id} />

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
          <button type="cancel" className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
