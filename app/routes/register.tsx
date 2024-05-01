import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";

import FormAddress from "~/components/formaddress";
import {
  createUser,
  getAllAdminUsers,
  getUserById,
  updateUser,
} from "~/controllers/users";
import { blankAddress } from "~/components/utils";
import Nav from "~/components/nav";
import { Roles } from "~/models/role";
import { useActionData } from "react-router";
import React from "react";
import SecondaryNav from "~/components/secondarynav";
import { createRegistration } from "~/controllers/registrations";
import NavNon from "~/components/navnon";
import { EmailType, sendEmail } from "~/components/myresend";

/*
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser.isLoggedIn) return redirect("/login");

  return { currentUser };
};

 */

export async function action({ request }: ActionFunctionArgs) {
  const formdata = Object.fromEntries(await request.formData());
  const registration = await createRegistration(formdata);

  console.log("\n\n registration result: " + JSON.stringify(registration));

  if (registration.hasOwnProperty("error")) {
    return registration;
  } else {
    const users = await getAllAdminUsers();
    const tos = [];
    users.map((i) => {
      tos.push(i.firstName + " " + i.lastName + "<" + i.email + ">");
    });
    const emailResult = await sendEmail({
      from: "onboarding@resend.dev", // registration.firstName + " " + registration.lastName + "<" + registration.email + ">"
      to: ["delivered@resend.dev"], // tos
      subject: "There is a new registration request",
      html: "click here <a href='http://localhost:5173/registrations/'>Registration Requests.</a>",
    } as EmailType);
    return redirect(
      `/login?mesg=Registration submitted to NSF CRM, once approved you will get an email`
    );
  }
}

export default function Register() {
  const data = useActionData<typeof action>();
  const address = blankAddress("personal");
  const navigate = useNavigate();

  return (
    <div className="container-md">
      <NavNon showLogin={false} />

      <h1>Register for Login</h1>

      <NavLink
        to="/login"
        className="dropdown-item flex-sm-fill text-sm-left nav-link"
        onClick={() => {
          navigate(-1);
        }}
      >
        Back to previous page
      </NavLink>

      <br />
      <Form key={"register"} id="register-form" method="post">
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
              placeholder="should look like an email"
              className="form-control"
            />
            {data && data.error.username && (
              <p className="text-danger">{data.error.username._errors[0]}</p>
            )}
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
          <button type="reset" className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
