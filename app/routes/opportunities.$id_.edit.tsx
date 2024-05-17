import {
  type ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";

import { useActionData } from "react-router";

import React, { useState } from "react";

import { isAuthenticated } from "~/services/auth.server";
import NavBar from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import {
  getAllActiveLeadStatuses,
  getAllActiveOOppStatuses,
} from "~/controllers/oppStatuses";
import { getAllActiveOppTypes } from "~/controllers/oppTypes";
import { getAllActiveOrgs } from "~/controllers/orgs";
import { getAllActivePersons } from "~/controllers/persons";
import { getAllActiveOppSources } from "~/controllers/oppSources";
import { getOppById, updateOpp } from "~/controllers/opps";
import invariant from "tiny-invariant";
import { getAllUsersByIsActive } from "~/controllers/users";
import { PAGE_MARGIN } from "~/models/misc";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  invariant(params.id, "Missing id param");

  const [
    opp,
    oppStatuses,
    leadStatuses,
    oppSources,
    oppTypes,
    orgs,
    persons,
    users,
  ] = await Promise.all([
    getOppById(params.id),
    getAllActiveOOppStatuses(),
    getAllActiveLeadStatuses(),
    getAllActiveOppSources(),
    getAllActiveOppTypes(),
    getAllActiveOrgs(),
    getAllActivePersons(),
    getAllUsersByIsActive(true),
  ]);
  // console.log("\n\n orgTypes=" + JSON.stringify(orgTypes, null, 2));
  //  console.log("\n\n orgIndustries=" + JSON.stringify(orgIndustries), null, 2 );

  let leadOrOpp = opp.type;

  return json({
    opp,
    currentUser,
    oppStatuses,
    leadStatuses,
    oppSources,
    oppTypes,
    orgs,
    persons,
    leadOrOpp,
    users,
  });
};

export async function action({ request }: ActionFunctionArgs) {
  const currentUser = await isAuthenticated(request);
  const formdata = Object.fromEntries(await request.formData());

  console.log(
    "\n\n opp edit action request?: " + JSON.stringify(request, null, 2)
  );

  console.log(
    "\n\nopp action update formdata?: " + JSON.stringify(formdata, null, 2)
  );

  if (formdata.hasOwnProperty("convertLead") && formdata.convertLead === "1") {
    formdata.type = "O";
    formdata.opportunityStatus = "Lead Converted to Opportunity";
  }

  const org = await updateOpp(formdata, currentUser.id);

  console.log("\n\nopp update action result: " + JSON.stringify(org, null, 2));

  if (org.hasOwnProperty("error")) return org;
  else return redirect(`/opportunities/${org.id}`);
}

export default function OpportunitiesId_Edit() {
  const data = useActionData<typeof action>();
  const {
    opp,
    currentUser,
    oppStatuses,
    leadStatuses,
    oppSources,
    oppTypes,
    orgs,
    persons,
    leadOrOpp,
    users,
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [isOrgDisabled, setIsOrgDisabled] = useState(false);
  const [isPersonDisabled, setIsPersonDisabled] = useState(false);

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
      <NavBar
        role={currentUser.role}
        isLoggedIn={currentUser.isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <div className={PAGE_MARGIN}>
        <h1>Edit {opp.type == "L" ? "Lead" : "Opportunity"}</h1>
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
            You should associate an Organization or a Person with the
            Opportunity. If you choose an Org, Person will be inaccessible
            unless you set it to empty. Same goes for Person, Org will be
            inaccessible until Person is set to empty. One or the other is
            required to save.
          </li>
          {opp.type == "L" ? (
            <li>
              An Opportunity can be a Lead, just use an appropriate Status
            </li>
          ) : (
            <></>
          )}
        </ul>
        <Form
          key="oppcreate"
          id="creatopp-form"
          method="post"
          className="padding ps-2"
        >
          <input type="hidden" name="id" value={opp.id} />

          <input type="hidden" name="type" value={leadOrOpp} />
          <div className="row">
            <div className="col-2 align-text-top">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
            </div>
            <div className="col-9 lead align-text-top">
              <input
                name="name"
                type="text"
                placeholder="Use a meaningful name for your Opportunity"
                className="form-control"
                required={true}
                defaultValue={opp.name}
              />
              {data && data.error.name && (
                <p className="text-danger">{data.error.name._errors[0]}</p>
              )}
            </div>
          </div>
          <div className={isOrgDisabled ? "d-none" : "d-block"}>
            <div className="row">
              <div className="col-2 align-text-top">
                <label htmlFor="orgId" className="form-label">
                  Associate an Organization:
                </label>
              </div>
              <div className="col-9 lead align-text-top">
                <select
                  name="orgId"
                  className="form-control"
                  onChange={handleOrgChange}
                  disabled={isOrgDisabled}
                  defaultValue={opp.orgId}
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
            </div>
          </div>

          <div className={isPersonDisabled ? "d-none" : "d-block"}>
            <div className="row">
              <div className="col-2 align-text-top">
                <label htmlFor="orgId" className="form-label">
                  Associate a Person:
                </label>
              </div>
              <div className="col-9 lead align-text-top">
                <select
                  name="personId"
                  className="form-control"
                  onChange={handlePersonChange}
                  disabled={isPersonDisabled}
                  defaultValue={opp.personId}
                >
                  <option value="">Choose Person or leave empty</option>
                  {persons.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.firstName + " " + o.lastName}
                    </option>
                  ))}
                </select>
                {data && data.error.personId && (
                  <p className="text-danger">
                    {data.error.personId._errors[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={opp.type == "O" ? "d-block" : "d-none"}>
            <div className="row">
              <div className="col-2 align-text-top">
                <label htmlFor="opportunityType" className="form-label">
                  Type:
                </label>
              </div>
              <div className="col-9 lead align-text-top">
                <select
                  name="opportunityType"
                  className="form-control"
                  defaultValue={opp.opportunityType}
                >
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
            </div>
          </div>

          <div className={opp.type == "O" ? "d-block" : "d-none"}>
            <div className="row">
              <div className="col-2 align-text-top">
                <label
                  htmlFor="opportunityStatus"
                  className="form-label"
                  defaultValue={opp.opportunityStatus}
                >
                  Status:
                </label>
              </div>
              <div className="col-9 lead align-text-top">
                <select name="opportunityStatus" className="form-control">
                  <option value="">Choose Status</option>
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
            </div>
          </div>

          <div className={opp.type == "L" ? "d-block" : "d-none"}>
            <div className="row">
              <div className="col-2 align-text-top">
                <label
                  htmlFor="opportunityStatus"
                  className="form-label"
                  defaultValue={opp.opportunityStatus}
                >
                  Status:
                </label>
              </div>
              <div className="col-9 lead align-text-top">
                <select name="opportunityStatus" className="form-control">
                  <option value="">Choose Status</option>
                  {leadStatuses.map((o) => (
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
            </div>
          </div>

          <div className="row">
            <div className="col-2 align-text-top">
              <label htmlFor="opportunitySource" className="form-label">
                Source:
              </label>
            </div>
            <div className="col-9 lead align-text-top">
              <select
                name="opportunitySource"
                className="form-control"
                defaultValue={opp.opportunitySource}
              >
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
          </div>

          <div className={opp.type == "O" ? "d-block" : "d-none"}>
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
                  defaultValue={opp.isActive ? "yes" : "no"}
                >
                  <option key="yes" value="yes" defaultValue="yes">
                    Yes
                  </option>
                  <option key="no" value="no">
                    No
                  </option>
                </select>
                {data && data.error.isActive && (
                  <p className="text-danger">
                    {data.error.isActive._errors[0]}
                  </p>
                )}
              </div>
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
                name="description"
                placeholder="Description"
                className="form-control"
                defaultValue={opp.description}
              />
              {data && data.error.description && (
                <p className="text-danger">
                  {data.error.description._errors[0]}
                </p>
              )}
            </div>
          </div>

          <div className={opp.type == "O" ? "d-block" : "d-none"}>
            <div className="row">
              <div className="col-2 align-text-top">
                <label htmlFor="expectedCloseDate" className="form-label">
                  Expected Close Date:
                </label>
              </div>
              <div className="col-9 lead align-text-top">
                <input
                  name="expectedCloseDate"
                  type="date"
                  placeholder=""
                  className="form-control"
                  defaultValue={opp.expectedCloseDate}
                />
                {data && data.error.expectedCloseDate && (
                  <p className="text-danger">
                    {data.error.expectedCloseDate._errors[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={opp.type == "O" ? "d-block" : "d-none"}>
            <div className="row">
              <div className="col-2 align-text-top">
                <label htmlFor="expectedOutcome" className="form-label">
                  Expected Outcome:
                </label>
              </div>
              <div className="col-9 lead align-text-top">
                <textarea
                  name="expectedOutcome"
                  placeholder=""
                  className="form-control"
                  defaultValue={opp.expectedOutcome}
                />
                {data && data.error.expectedOutcome && (
                  <p className="text-danger">
                    {data.error.expectedOutcome._errors[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={opp.type == "O" ? "d-block" : "d-none"}>
            <div className="row">
              <div className="col-2 align-text-top">
                <label htmlFor="activityDiscussion" className="form-label">
                  Activity Discussion:
                </label>
              </div>
              <div className="col-9 lead align-text-top">
                <textarea
                  name="activityDiscussion"
                  placeholder=""
                  className="form-control"
                  defaultValue={opp.activityDiscussion}
                />
                {data && data.error.activityDiscussion && (
                  <p className="text-danger">
                    {data.error.activityDiscussion._errors[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={opp.type == "O" ? "d-block" : "d-none"}>
            <div className="row">
              <div className="col-2 align-text-top">
                <label htmlFor="actualClosedDate" className="form-label">
                  Actual Closed Date:
                </label>
              </div>
              <div className="col-9 lead align-text-top">
                <input
                  name="actualClosedDate"
                  type="date"
                  placeholder=""
                  className="form-control"
                  defaultValue={opp.actualClosedDate}
                />
                {data && data.error.actualClosedDate && (
                  <p className="text-danger">
                    {data.error.actualClosedDate._errors[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={opp.type == "O" ? "d-block" : "d-none"}>
            <div className="row">
              <div className="col-2 align-text-top">
                <label htmlFor="closeddOutcome" className="form-label">
                  Closed Outcome:
                </label>
              </div>
              <div className="col-9 lead align-text-top">
                <textarea
                  name="closeddOutcome"
                  placeholder=""
                  className="form-control"
                  defaultValue={opp.closedOutcome}
                />
                {data && data.error.closeddOutcome && (
                  <p className="text-danger">
                    {data.error.closeddOutcome._errors[0]}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border border-primary border-2 gx-10">
            <label htmlFor="ownerId" className="form-label">
              Owner
            </label>

            {opp.ownerId === currentUser.id ? (
              <select
                name="ownerId"
                className="form-control"
                defaultValue={opp.ownerId}
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
                {opp.owner.firstName + " " + opp.owner.lastName}
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
            {leadOrOpp == "L" ? (
              <button
                type="submit"
                className="btn btn-info"
                name="convertLead"
                value="1"
              >
                Save as Opportunity
              </button>
            ) : (
              <></>
            )}
            <button type="reset" className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
