import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, NavLink, useLoaderData } from "@remix-run/react";
import { authenticator, isAuthenticated } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/session.server";
import React from "react";
import NavNon from "~/components/navnon";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const mesg = url.searchParams.get("mesg");

  return mesg;
};
export async function action({ request }: ActionFunctionArgs) {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
}

export default function LoginPage() {
  const mesg = useLoaderData<typeof loader>();

  return (
    <div className="container-md">
      <NavNon noLogin={true} />

      <h1>Login</h1>
      {mesg ? <h3>{mesg}</h3> : <></>}
      <Form method="post">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            name="username"
            className="form-control"
            id="username"
            placeholder="name@example.com"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            className="form-control"
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </div>

        <button>Sign In</button>
        <br />
        <br />
        <span className="nav-item">
          <NavLink to="/forgotpassword" className="nav-link">
            Forgot Password
          </NavLink>
          <NavLink to="/register" className="nav-link">
            Sign Up
          </NavLink>
        </span>
      </Form>
    </div>
  );
}
