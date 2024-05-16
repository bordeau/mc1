import {
  type ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";

import React from "react";
import { isAuthenticated } from "~/services/auth.server";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import { Roles } from "~/models/role";
import {
  getAllActivePersons,
  getAllPersons,
  getLikeNamePersons,
} from "~/controllers/persons";
import { EmptyLetterTray } from "~/components/icons";
import { createPersonOrg } from "~/controllers/personsOrgs";
import { getOppById } from "~/controllers/opps";
import { undefined } from "zod";
import { getAllUsersByIsActive } from "~/controllers/users";
import {
  createOppTeam,
  findOppTeamByOppId,
  getOppTeamByOppId,
} from "~/controllers/opportunityTeam";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser.isLoggedIn) return redirect("/login");

  invariant(params.id, "Missing ID param");

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const backm1 = url.searchParams.get("back");
  const whichBack = backm1 ? 1 : 0;

  let item;
  let persons;
  let users;

  if (q == null) {
    [item, persons, users] = await Promise.all([
      getOppById(params.id),
      getAllActivePersons(),
      getAllUsersByIsActive(true),
    ]);
  }
  //
  else {
    [item, persons, users] = await Promise.all([
      getOppById(params.id),
      getLikeNamePersons(q),
      getAllUsersByIsActive(true),
    ]);
  }

  const oppTeam = item.opportunityTeam;

  let oppTeamInt = [];
  let oppTeamExt = [];
  if (oppTeam.length > 0) {
    let i = 0;
    for (i; i < oppTeam.length; i++) {
      const gg = oppTeam[i];
      if (gg.user != null) {
        const user = {
          id: gg.id,
          role: gg.role,
          userId: gg.user.id,
          firstName: gg.user.firstName,
          lastName: gg.user.lastName,
        };
        oppTeamInt.push(user);
      }
      if (gg.person != null) {
        const person = {
          id: gg.id,
          role: gg.role,
          personId: gg.person.id,
          firstName: gg.person.firstName,
          lastName: gg.person.lastName,
        };
        oppTeamExt.push(person);
      }
    }
  }

  // console.log("\n\nopp loader item:" + JSON.stringify(item, null, 2));
  // console.log("\n\nopp loader item:" + JSON.stringify(oppTeam, null, 2));

  if (!item) {
    throw new Response("Not Found", { status: 404 });
  }
  return { currentUser, item, whichBack, q, users, oppTeamInt, oppTeamExt };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formdata = Object.fromEntries(await request.formData());

  // console.log("\noppteam link formdata?: " + JSON.stringify(formdata, null, 2));

  const item = await createOppTeam(formdata);

  // console.log("\n\n oppteam link formdata?: " + JSON.stringify(item, null, 2));

  if (item.hasOwnProperty("error")) return item;
  else return redirect(`/opportunities/${item.opportunityId}`);

  return {};
};

export default function OpportunitiesId() {
  const { currentUser, item, whichBack, q, users, oppTeamInt, oppTeamExt } =
    useLoaderData<typeof loader>();

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isManager = Roles.isManager(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  // console.log("\n\n org detail: " + JSON.stringify(item, null, 2));
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return (
    <>
      <Nav
        isAdmin={isAdmin}
        isManager={isManager}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <h1>{item.type == "O" ? "Opportunity" : "Lead"} Detail</h1>
      <SecondaryNav
        target="opportunities"
        id={item.id}
        canDelete={false}
        canCreate={true}
        canEdit={true}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={!whichBack}
        showBack1={whichBack}
        backTarget={"opportunities"}
        showBackTitle={!whichBack ? "Back to List" : "Back to Person Detail"}
        what={item.type == "O" ? "Opportunity" : "Lead"}
      />
      <br />

      <div key={item.id}>
        <div className="row">
          <h6 className="col-2 align-text-top">Name:</h6>
          <p className="col-7 lead align-text-top">{item.name}</p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Organization</h6>
          <p className="col-7 lead align-text-top">
            {item.orgs ? item.orgs.name : <EmptyLetterTray />}
          </p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Person</h6>
          <p className="col-7 lead align-text-top">
            {item.persons ? (
              item.persons.firstName + " " + item.persons.lastName
            ) : (
              <EmptyLetterTray />
            )}
          </p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Is Active?</h6>
          <p className="col-7 lead align-text-top">
            {item.isActive ? "Yes" : "No"}
          </p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Status:</h6>
          <p className="col-7 lead align-text-top">
            {item.opportunityStatus ? (
              item.opportunityStatus
            ) : (
              <EmptyLetterTray />
            )}
          </p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Type:</h6>
          <p className="col-7 lead align-text-top">
            {item.opportunityType ? item.opportunityType : <EmptyLetterTray />}
          </p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Industry:</h6>
          <p className="col-7 lead align-text-top">
            {item.opportunitySource ? (
              item.opportunitySource
            ) : (
              <EmptyLetterTray />
            )}
          </p>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Description:</h6>
          <p className="col-7 lead align-text-top">
            {item.description ? item.description : <EmptyLetterTray />}
          </p>
        </div>

        <div className={item.type == "O" ? "d-block" : "d-none"}>
          <div className="row">
            <h6 className="col-2 align-text-top">Expected Close Date:</h6>
            <p className="col-7 lead align-text-top">
              {item.expectedCloseDate ? (
                item.expectedCloseDate
              ) : (
                <EmptyLetterTray />
              )}
            </p>
          </div>
        </div>

        <div className={item.type == "O" ? "d-block" : "d-none"}>
          <div className="row">
            <h6 className="col-2 align-text-top">Expected Outcome:</h6>
            <p className="col-7 lead align-text-top">
              {item.expectedOutcome ? (
                item.expectedOutcome
              ) : (
                <EmptyLetterTray />
              )}
            </p>
          </div>
        </div>

        <div className={item.type == "O" ? "d-block" : "d-none"}>
          <div className="row">
            <h6 className="col-2 align-text-top">Activity Discussion:</h6>
            <p className="col-7 lead align-text-top">
              {item.activityDiscussion ? (
                item.activityDiscussion
              ) : (
                <EmptyLetterTray />
              )}
            </p>
          </div>
        </div>

        <div className={item.type == "O" ? "d-block" : "d-none"}>
          <div className="row">
            <h6 className="col-2 align-text-top">Actual Closed Date:</h6>
            <p className="col-7 lead align-text-top">
              {item.actualClosedDate ? (
                item.actualClosedDate
              ) : (
                <EmptyLetterTray />
              )}
            </p>
          </div>
        </div>

        <div className={item.type == "O" ? "d-block" : "d-none"}>
          <div className="row">
            <h6 className="col-2 align-text-top">Closed Outcome:</h6>
            <p className="col-7 lead align-text-top">
              {item.closedOutcome ? item.closedOutcome : <EmptyLetterTray />}
            </p>
          </div>
        </div>

        <div className="row">
          <h6 className="col-2 align-text-top">Owner:</h6>
          <p className="col-7 lead align-text-top">
            {item.owner.firstName + " " + item.owner.lastName}
          </p>
        </div>
      </div>

      <div className={item.type == "O" ? "d-block" : "d-none"}>
        <h4 className="mt-xl-4">Opportunity Team</h4>
        <p className="fs-6">
          There can always be internal team members. Also, there can be external
          team members when the opportunity is associated with an organization.
          In this case, make certain to associate the organization with related
          persons. When the opportunity is associated with a person, then it is
          an opportunity with that individual person and there is no external
          team.
        </p>
        <h5 className="mt-xl-4">Opportunity Internal Team</h5>
        {oppTeamInt != null && oppTeamInt.length ? (
          <div className="flex-column">
            <div className="row">
              <div className="col-sm-5">Member</div>
              <div className="col-sm-4">Role</div>
            </div>
            {oppTeamInt.map((morg) => (
              <div className="row" key={morg.id}>
                <div className="col-sm-5">
                  <Link
                    to={"/opportunityTeam/" + morg.id}
                    className="nav-link"
                    aria-current="page"
                  >
                    {morg.firstName + "  " + morg.lastName}
                  </Link>
                </div>
                <div className="col-sm-4">{morg.role}</div>
              </div>
            ))}
          </div>
        ) : (
          <i>No Associated Internal Team Members</i>
        )}

        <div className="accordion-body">
          <div className="accordion " id="associateAccordian">
            <div className="accordion-item">
              <h4 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Associate Internal Opportunity Team Members
                </button>
              </h4>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#associateAccordian"
              >
                <nav className="nav flex-column my-5">
                  <Form method="post">
                    <input type="hidden" name="opportunityId" value={item.id} />
                    <div className="row">
                      <div className="col-sm-5">
                        <select name="userId" className="form-control">
                          <option value="">Choose Internal User</option>
                          {users.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.lastName}, {o.firstName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <input
                          name="role"
                          type="text"
                          placeholder="Role"
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="mg-3">
                      <button type="submit" className="btn btn-primary">
                        Associate Team Member
                      </button>
                      <button type="reset" className="btn btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </Form>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            item.orgId != null && item.personId == null ? "d-block" : "d-none"
          }
        >
          <h5 className="mt-xl-4">Opportunity External Team</h5>
          {oppTeamExt != null && oppTeamExt.length ? (
            <div className="flex-column">
              <div className="row">
                <div className="col-sm-5">Member</div>
                <div className="col-sm-4">Role</div>
              </div>
              {oppTeamExt.map((morg) => (
                <div className="row" key={morg.id}>
                  <div className="col-sm-5">
                    <Link
                      to={"/persons/" + morg.personId}
                      className="nav-link"
                      aria-current="page"
                    >
                      {morg.firstName + "  " + morg.lastName}
                    </Link>
                  </div>
                  <div className="col-sm-4">{morg.role}</div>
                </div>
              ))}
            </div>
          ) : (
            <i>No Associated External Team Members</i>
          )}

          <div className="accordion-body">
            <div className="accordion " id="associateAccordian2">
              <div className="accordion-item">
                <h4 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    Associate External Opportunity Team Members
                  </button>
                </h4>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingThree"
                  data-bs-parent="#associateAccordian2"
                >
                  <nav className="nav flex-column my-5">
                    <p>
                      Make sure the External Team member that you want to
                      associate is associated to the Opportunity's Organization
                    </p>
                    <Form method="post">
                      <input
                        type="hidden"
                        name="opportunityId"
                        value={item.id}
                      />
                      <div className="row">
                        <div className="col-sm-5">
                          <select name="userId" className="form-control">
                            <option value="">Choose External Person</option>
                            {users.map((o) => (
                              <option key={o.id} value={o.id}>
                                {o.lastName}, {o.firstName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <input
                            name="role"
                            type="text"
                            placeholder="Role"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="mg-3">
                        <button type="submit" className="btn btn-primary">
                          Associate Team Member
                        </button>
                        <button type="reset" className="btn btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </Form>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h4>Opportunity History</h4>
      <div className="row">
        <p className="col-2 align-text-top fs s-7">Date</p>
        <p className="col-2 align-text-top fs s-7">Change By</p>
        <p className="col-7 align-text-top fs s-7">Fields Changes</p>
      </div>
      {item.opportunityHistory.map((nn) => (
        <div className="row">
          <p className="col-2 align-text-top fs s-7">
            {new Date(nn.createdaAt).toLocaleDateString(undefined, options)}
          </p>
          <p className="col-2 align-text-top fs fs-7">
            {nn.user.firstName + " " + nn.user.lastName}
          </p>
          <p className="col-7 align-text-top fs fs-7">
            {JSON.parse(nn.data).map((hh) => (
              <p className="fs fs-7">
                Field: {hh.name}&nbsp;&nbsp;&nbsp; Old: {hh.orig}{" "}
                &nbsp;&nbsp;&nbsp; New: {hh.new}
              </p>
            ))}
          </p>
        </div>
      ))}
    </>
  );
}
