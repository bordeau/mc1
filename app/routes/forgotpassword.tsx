import { Form, NavLink, useNavigate } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { createPasswordReset, getUserByUsername } from "~/controllers/users";

import { useActionData } from "react-router";

import { z } from "zod";
import {
  ReactPasswordResetEmailType,
  sendPasswordResetEmail,
} from "~/components/emailTemplates/myreactemailresend";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await Object.fromEntries(await request.formData());

  const schema = z.object({
    username: z.string().min(2, { message: "Username is required" }),
    email: z.string().email().min(5, { message: "Email is required" }),
  });
  const validatedData = schema.safeParse(formData);

  // console.log("\n\n validatedData: " + JSON.stringify(validatedData, null, 2));

  if (validatedData.success == false) {
    console.log("\n\nreturning to previous");
    return { error: validatedData.error.format() };
  }

  const parsedData = validatedData.data;

  const user = await getUserByUsername(parsedData.username);
  /*
  console.log(
    "\n\n change password action formdata: " + JSON.stringify(parsedData)
  );
  console.log("\n\n change password action user: " + JSON.stringify(user));
*/
  let pwr;
  if (
    user &&
    user.username === parsedData.username &&
    user.email === parsedData.email
  ) {
    pwr = await createPasswordReset(user.id);

    const er = await sendPasswordResetEmail({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Your password change request",
      name: user.firstName + " " + user.lastName,
      passwordLink: "http://localhost:5173/resetpassword/" + pwr.id,
    } as ReactPasswordResetEmailType);

    // console.log("\n\n change password action result: " + JSON.stringify(er));
  }

  if (user.hasOwnProperty("error")) return pwr;
  else return redirect(`/login`);
}

/// used to request to change password.. sends email if username/email matches that email will have link to change password
export default function Forgotpassword() {
  const data = useActionData<typeof action>();
  const navigate = useNavigate();

  return (
    <>
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
        <h1>Change Password Request</h1>
        <NavLink
          to="/login"
          className="dropdown-item flex-sm-fill text-sm-left nav-link"
          onClick={() => {
            navigate(-1);
          }}
        >
          Back to previous page
        </NavLink>
        <Form key="resetpassword" id="user-form" method="post">
          <p>
            Please enter your Username and Email. If there is a match, you will
            receive an email with a link to change your password.
          </p>

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
              <label htmlFor="email" className="form-label">
                Email:
              </label>
            </h6>
            <p className="col-7 lead align-text-top">
              <input
                defaultValue=""
                name="email"
                type="text"
                placeholder="email"
                className="form-control"
              />
              {data && data.error.email && (
                <p className="text-danger">{data.error.email._errors[0]}</p>
              )}
            </p>
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
    </>
  );
}
