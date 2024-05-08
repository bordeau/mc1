import {
  type ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";

import FormAddress from "~/components/formaddress";
import { useActionData } from "react-router";
import { getAllOrgTypes } from "~/controllers/orgTypes";
import React, { useState } from "react";
import { getAllOrgIndustries } from "~/controllers/orgIndustries";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import { getAllOppStatuses } from "~/controllers/oppStatuses";
import { getAllOppTypes } from "~/controllers/oppTypes";
import { getAllActiveOrgs } from "~/controllers/orgs";
import { getAllActivePersons } from "~/controllers/persons";
import { getAllOppSources } from "~/controllers/oppSources";
import { createOpp } from "~/controllers/opps";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const [oppStatuses, oppSources, oppTypes, orgs, persons] = await Promise.all([
    getAllOppStatuses(),
    getAllOppSources(),
    getAllOppTypes(),
    getAllActiveOrgs(),
    getAllActivePersons(),
  ]);
  // console.log("\n\n orgTypes=" + JSON.stringify(orgTypes, null, 2));
  //  console.log("\n\n orgIndustries=" + JSON.stringify(orgIndustries), null, 2 );

  return json({
    currentUser,
    oppStatuses,
    oppSources,
    oppTypes,
    orgs,
    persons,
  });
};

export async function action({ request }: ActionFunctionArgs) {
  const formdata = Object.fromEntries(await request.formData());

  console.log("\n\norg create formdata?: " + JSON.stringify(formdata, null, 2));

  const org = await createOpp(formdata);

  console.log("\n\n create result: " + JSON.stringify(org, null, 2));

  if (org.hasOwnProperty("error")) return org;
  else return redirect(`/opportunities/${org.id}`);
}

export default function OpportunitiesCreate() {
  const data = useActionData<typeof action>();
  const { currentUser, oppStatuses, oppSources, oppTypes, orgs, persons } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [isOrgDisabled, setIsOrgDisabled] = useState(false);
  const [isPersonDisabled, setIsPersonDisabled] = useState(false);

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  function handleOrgChange(e) {
    if (e.target.value != "") setIsPersonDisabled(true);
    else setIsPersonDisabled(false);
  }

  function handlePersonChange(e) {
    if (e.target.value != "") setIsOrgDisabled(true);
    else setIsOrgDisabled(false);
  }

  return (
    <>
      <Nav
        isAdmin={isAdmin}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <h1>Create Opportunity</h1>
      <SecondaryNav
        target="opportunities"
        canDelete={false}
        canCreate={false}
        canEdit={false}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={"opportunities"}
        what="Opportunity"
      />
      <br />

      <ul>
        <li>
          You should associate an Organization or a Person with the Opportunity.
          If you choose an Org, Person will be disabled unless you set it to
          empty. Same goes for Person, Org will be disabled until Person is set
          to empty. One or the other is required.
        </li>
        <li>An Opportunity can be a Lead, just use an appropriate Status</li>
      </ul>
      <Form key="oppcreate" id="creatopp-form" method="post">
        <input type="hidden" name="ownerId" value={currentUser.id} />
        <div className="mg-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>

          <input
            name="name"
            type="text"
            placeholder="Use a meaningful name for your Opportunity"
            className="form-control"
            required={true}
          />
          {data && data.error.name && (
            <p className="text-danger">{data.error.name._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="orgId" className="form-label">
            Associate an Organization:
          </label>

          <select
            name="orgId"
            className="form-control"
            onChange={handleOrgChange}
            disabled={isOrgDisabled}
          >
            <option value="">Choose Org or leave empty</option>
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          {data && data.error.orgId && (
            <p className="text-danger">{data.error.orgId._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="orgId" className="form-label">
            Associate a Person:
          </label>

          <select
            name="personId"
            className="form-control"
            onChange={handlePersonChange}
            disabled={isPersonDisabled}
          >
            <option value="">Choose Person or leave empty</option>
            {persons.map((o) => (
              <option key={o.id} value={o.id}>
                {o.firstName + " " + o.lastName}
              </option>
            ))}
          </select>
          {data && data.error.personId && (
            <p className="text-danger">{data.error.personId._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="opportunityStatus" className="form-label">
            Status:
          </label>

          <select name="opportunityStatus" className="form-control">
            <option value="">Choose Source</option>
            {oppStatuses.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id}
              </option>
            ))}
          </select>
          {data && data.error.opportunityStatus && (
            <p className="text-danger">
              {data.error.opportunityStatus._errors[0]}
            </p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="opportunityType" className="form-label">
            Type:
          </label>

          <select name="opportunityType" className="form-control">
            <option value="">Choose Opportunity Type</option>
            {oppTypes.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id}
              </option>
            ))}
          </select>
          {data && data.error.opportunityType && (
            <p className="text-danger">
              {data.error.opportunityType._errors[0]}
            </p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="opportunitySource" className="form-label">
            Source:
          </label>

          <select name="opportunitySource" className="form-control">
            <option value="">Choose Source</option>
            {oppSources.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id}
              </option>
            ))}
          </select>
          {data && data.error.opportunitySource && (
            <p className="text-danger">
              {data.error.opportunitySource._errors[0]}
            </p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="isActive" className="form-label">
            Active?
          </label>

          <select name="isActive" className="form-control">
            <option key="yes" value="yes" defaultValue="yes">
              Yes
            </option>
            <option key="no" value="no">
              No
            </option>
          </select>
          {data && data.error.isActive && (
            <p className="text-danger">{data.error.isActive._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>

          <textarea
            name="description"
            placeholder="Description"
            className="form-control"
          />
          {data && data.error.description.website && (
            <p className="text-danger">{data.error.description._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="expectedCloseDate" className="form-label">
            Expected Close Date:
          </label>

          <input
            name="expectedCloseDate"
            type="date"
            placeholder=""
            className="form-control"
          />
          {data && data.error.expectedCloseDate && (
            <p className="text-danger">
              {data.error.expectedCloseDate._errors[0]}
            </p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="expectedOutcome" className="form-label">
            Expected Outcome:
          </label>

          <textarea
            name="expectedOutcome"
            placeholder=""
            className="form-control"
          />
          {data && data.error.expectedOutcome && (
            <p className="text-danger">
              {data.error.expectedOutcome._errors[0]}
            </p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="activityDiscussion" className="form-label">
            Activity Discussion:
          </label>

          <textarea
            name="activityDiscussion"
            placeholder=""
            className="form-control"
          />
          {data && data.error.activityDiscussion.website && (
            <p className="text-danger">
              {data.error.activityDiscussion._errors[0]}
            </p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="actualClosedDate" className="form-label">
            Actual Closed Date:
          </label>

          <input
            name="actualClosedDate"
            type="date"
            placeholder=""
            className="form-control"
          />
          {data && data.error.actualClosedDate && (
            <p className="text-danger">
              {data.error.actualClosedDate._errors[0]}
            </p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="closeddOutcome" className="form-label">
            Closed Outcome:
          </label>

          <textarea
            name="closeddOutcome"
            placeholder=""
            className="form-control"
          />
          {data && data.error.closeddOutcome && (
            <p className="text-danger">
              {data.error.closeddOutcome._errors[0]}
            </p>
          )}
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
    </>
  );
}
