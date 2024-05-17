import {
  type ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";

import { createOrg, getOrgById } from "~/controllers/orgs";
import FormAddress from "~/components/formaddress";
import { useActionData } from "react-router";
import { getAllOrgTypes } from "~/controllers/orgTypes";
import React from "react";
import { getAllOrgIndustries } from "~/controllers/orgIndustries";
import { isAuthenticated } from "~/services/auth.server";
import SecondaryNav from "~/components/secondarynav";
import NavBar from "~/components/nav";
import { PAGE_MARGIN } from "~/models/misc";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const [orgTypes, orgIndustries] = await Promise.all([
    getAllOrgTypes(),
    getAllOrgIndustries(),
  ]);
  // console.log("\n\n orgTypes=" + JSON.stringify(orgTypes, null, 2));
  //  console.log("\n\n orgIndustries=" + JSON.stringify(orgIndustries), null, 2 );

  return json({ currentUser, orgTypes, orgIndustries });
};

export async function action({ request }: ActionFunctionArgs) {
  const formdata = Object.fromEntries(await request.formData());

  console.log("\n\norg create formdata?: " + JSON.stringify(formdata, null, 2));

  const org = await createOrg(formdata);

  console.log("\n\n create result: " + JSON.stringify(org, null, 2));

  if (org.hasOwnProperty("error")) return org;
  else return redirect(`/organizations/${org.id}`);
}

export default function OrgCreate() {
  const data = useActionData<typeof action>();
  const { currentUser, orgTypes, orgIndustries } =
    useLoaderData<typeof loader>();

  return (
    <>
      <NavBar
        role={currentUser.role}
        isLoggedIn={currentUser.isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <div className={PAGE_MARGIN}>
        <h1>User Detail</h1>
        <SecondaryNav
          target="organizations"
          canDelete={false}
          canCreate={false}
          canEdit={false}
          canClone={false}
          viewLoginLog={false}
          viewDetail={false}
          showBack={true}
          backTarget={"organizations"}
          what="Organization"
        />
        <br />

        <h1>Create Organization</h1>

        <Form key="personcreate" id="person-form" method="post">
          <input type="hidden" name="ownerId" value={currentUser.id} />
          <div className="mg-3">
            <label htmlFor="name" className="form-label">
              Name:
            </label>

            <input
              name="name"
              type="text"
              placeholder="Name"
              className="form-control"
              required={true}
            />
            {data && data.error.name && (
              <p className="text-danger">{data.error.name._errors[0]}</p>
            )}
          </div>

          <div className="mg-3">
            <label htmlFor="orgType" className="form-label">
              Type:
            </label>

            <select name="orgType" className="form-control">
              <option value="">Choose Organization Type</option>
              {orgTypes.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id}
                </option>
              ))}
            </select>
            {data && data.error.orgType && (
              <p className="text-danger">{data.error.orgType._errors[0]}</p>
            )}
          </div>

          <div className="mg-3">
            <label htmlFor="phone" className="form-label">
              Industry:
            </label>

            <select name="orgIndustry" className="form-control">
              <option value="">Choose Industry</option>
              {orgIndustries.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id}
                </option>
              ))}
            </select>
            {data && data.error.orgIndustry && (
              <p className="text-danger">{data.error.orgIndustry._errors[0]}</p>
            )}
          </div>

          <div className="mg-3">
            <label htmlFor="isActive" className="form-label">
              Active?
            </label>

            <select name="isActive" className="form-control">
              <option key="yes" value="yes" selected={true}>
                Yes
              </option>
              <option key="no" value="no">
                No
              </option>
            </select>
            {data && data.error.website && (
              <p className="text-danger">{data.error.isActive._errors[0]}</p>
            )}
          </div>

          <div className="mg-3">
            <label htmlFor="website" className="form-label">
              Website:
            </label>

            <input
              name="website"
              type="text"
              placeholder="Website"
              className="form-control"
            />
            {data && data.error.website && (
              <p className="text-danger">{data.error.website._errors[0]}</p>
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
              type="organizational"
              typeLabel="Organizational Address"
              street1=""
              street2=""
              city=""
              state=""
              country=""
              zip=""
            />
          </div>

          <div className="mg-3">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="reset" className="btn btn-primary">
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
