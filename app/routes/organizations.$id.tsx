import {
  type ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";

import PlainAddress from "~/components/plainaddress";
import { getLikeNameOrgs, getOrgById } from "~/controllers/orgs";

import { blankAddress } from "~/components/utils";
import React from "react";
import { isAuthenticated } from "~/services/auth.server";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";
import { Roles } from "~/models/role";
import { getAllPersons, getLikeNamePersons } from "~/controllers/persons";
import { EmptyLetterTray } from "~/components/icons";
import { createPersonOrg } from "~/controllers/personsOrgs";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing ID param");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const backm1 = url.searchParams.get("back");
  const whichBack = backm1 ? 1 : 0;

  let org;
  let persons;
  if (q == null) {
    [org, persons] = await Promise.all([
      getOrgById(params.id),
      getAllPersons(),
    ]);
  }
  //
  else {
    [org, persons] = await Promise.all([
      getOrgById(params.id),
      getLikeNamePersons(q),
    ]);
  }

  const personOrgs = org.personsOrgs;

  let showPersons = [];
  let i = 0;
  // console.log("\n\n person: " + JSON.stringify(person, null, 2));
  // console.log("\n\n personOrgs: " + JSON.stringify(personOrgs, null, 2));
  console.log("\n\n orgs: " + JSON.stringify(org, null, 2));

  // this bit of code makes sure the list of orgs that can be linked doesn't include already linked orgs
  for (i; i < persons.length; i++) {
    const oo = persons[i];

    // console.log("\n\n\n oo: " + JSON.stringify(oo, null, 2));
    // console.log("\n\n orgid: " + orgid);
    const t = personOrgs.find((oz) => oz.personId === oo.id);

    // console.log("\n\n t: " + t);

    if (!t) showPersons.push(oo);
  }

  // console.log("\n\norg loader org:" + JSON.stringify(org, null, 2));

  if (!org) {
    throw new Response("Not Found", { status: 404 });
  }
  return { currentUser, org, personOrgs, showPersons, whichBack, q };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formdata = Object.fromEntries(await request.formData());
  /*
  console.log(
    "\n\nperson/org link formdata?: " + JSON.stringify(formdata, null, 2)
  );
*/

  const personorg = await createPersonOrg(formdata);

  /*
  console.log(
    "\n\npersonOorg post link personOrg?: " + JSON.stringify(personorg, null, 2)
  );
*/

  if (personorg.hasOwnProperty("error")) return personorg;
  else return redirect(`/organizations/${personorg.orgId}`);

  return {};
};

export default function OrgDetail() {
  const { currentUser, org, personOrgs, showPersons, whichBack, q } =
    useLoaderData<typeof loader>();

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isManager = Roles.isManager(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  let address = blankAddress("organizational");
  if (org.address != null) {
    address = JSON.parse(org.address);

    // console.log("\n\n splitting address " + JSON.stringify(address, null, 2 ));
  }

  // console.log("\n\n org detail: " + JSON.stringify(org, null, 2));

  return (
    <>
      <Nav
        isAdmin={isAdmin}
        isManager={isManager}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <h1>Organization Detail</h1>
      <SecondaryNav
        target="organizations"
        id={org.id}
        canDelete={false}
        canCreate={true}
        canEdit={true}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={!whichBack}
        showBack1={whichBack}
        backTarget={"organizations"}
        showBackTitle={!whichBack ? "Back to List" : "Back to Person Detail"}
        what="Organization"
      />
      <br />

      <div className="row">
        <h6 className="col-2 align-text-top">Name:</h6>
        <p className="col-7 lead align-text-top">{org.name}</p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Is Active?</h6>
        <p className="col-7 lead align-text-top">
          {org.isActive ? "Yes" : "No"}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Type:</h6>
        <p className="col-7 lead align-text-top">
          {org.orgType ? org.orgType : <EmptyLetterTray />}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Industry:</h6>
        <p className="col-7 lead align-text-top">
          {org.orgIndustry ? org.orgIndustry : <EmptyLetterTray />}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Website:</h6>
        <p className="col-7 lead align-text-top">
          {org.website ? org.website : <EmptyLetterTray />}
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Description:</h6>
        <p className="col-7 lead align-text-top">
          {org.description ? org.description : <EmptyLetterTray />}
        </p>
      </div>

      <div className="accordion-body">
        <PlainAddress
          type="organizational"
          id={org.id}
          typeLabel="Organizational Address"
          street1={address.street1}
          street2={address.street2}
          city={address.city}
          state={address.state}
          country={address.country}
          zip={address.zip}
        />
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Owner:</h6>
        <p className="col-7 lead align-text-top">
          {org.owner.firstName + " " + org.owner.lastName}
        </p>
      </div>

      <h4 className="mt-xl-4">Associated Persons</h4>

      {personOrgs != null && personOrgs.length ? (
        <div className="flex-column">
          <div className="row">
            <div className="col-sm-5">Person</div>
            <div className="col-sm-4">Title</div>
          </div>
          {personOrgs.map((morg) => (
            <div className="row" key={morg.id}>
              <div className="col-sm-5">
                <Link
                  to={
                    "/personOrgs/" +
                    morg.id +
                    "?re=organizations/" +
                    morg.orgId +
                    "&ret=Back to Org Detail"
                  }
                  className="nav-link"
                  aria-current="page"
                >
                  {morg.person.firstName + " " + morg.person.lastName}
                </Link>
              </div>
              <div className="col-sm-4">{morg.title}</div>
            </div>
          ))}
        </div>
      ) : (
        <i>No Associated Organizations</i>
      )}
      <br />
      {showPersons != null && showPersons.length ? (
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
                  Associate Additional Persons
                </button>
              </h4>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#associateAccordian"
              >
                <Form
                  id="search-form"
                  role="search"
                  onChange={(event) => submit(event.currentTarget)}
                >
                  <input
                    aria-label="Search organizations"
                    defaultValue={q || ""}
                    id="q"
                    name="q"
                    placeholder="Search"
                    type="search"
                  />
                  {/* existing elements */}
                </Form>

                <p>
                  If you need to create a new Person,{" "}
                  <Link to="persons">Go to Persons</Link>, create the person
                  record, then you can associate the person to this organization
                  in the Person detail{" "}
                </p>

                <nav className="nav flex-column my-5">
                  <Form method="post">
                    <input type="hidden" name="orgId" value={org.id} />
                    <div className="row">
                      <div className="col-sm-2">Link</div>
                      <div className="col-sm-7">Organization Name</div>
                    </div>

                    {showPersons.map((pp) => (
                      <div className="row" key={pp.id}>
                        <div className="col-sm-2">
                          <input
                            type="checkbox"
                            name="personId"
                            value={pp.id}
                          />
                        </div>
                        <div className="col-sm-7">
                          <Link
                            to={`/persons/${pp.id}?back=1`}
                            className="nav-link"
                            aria-current="page"
                          >
                            {pp.firstName + " " + pp.lastName}
                          </Link>
                        </div>
                      </div>
                    ))}
                    <div className="mg-3">
                      <button type="submit" className="btn btn-primary">
                        Link
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
      ) : (
        <></>
      )}
    </>
  );
}
