import {
  type ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getPersonById } from "~/controllers/persons";
import PlainAddress from "~/components/plainaddress";
import { createPersonOrg } from "~/controllers/personsOrgs";
import React, { useEffect } from "react";
import { getAllOrgs, getLikeNameOrgs } from "~/controllers/orgs";
import { useActionData } from "react-router";
import { blankAddress } from "~/components/utils";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.personId, "Missing Person ID param");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  // console.log("\n\n q:" + q);

  let orgs;
  if (q == null) {
    orgs = await getAllOrgs();

    // return json({ orgs, q });
  } else {
    orgs = await getLikeNameOrgs(q);
    // return json({ orgs, q });
  }

  const person = await getPersonById(Number(params.id));
  if (!person) {
    throw new Response("Not Found", { status: 404 });
  }
  const personOrgs = person.orgs;

  let i = 0;
  let showOrgs = [];

  // console.log("\n\n person: " + JSON.stringify(person, null, 2));
  // console.log("\n\n personOrgs: " + JSON.stringify(personOrgs, null, 2));

  // this bit of code makes sure the list of orgs that can be linked doesn't include already linked orgs
  for (i; i < orgs.length; i++) {
    const oo = orgs[i];
    const orgid = oo.id;

    // console.log("\n\n\n oo: " + JSON.stringify(oo, null, 2));
    // console.log("\n\n orgid: " + orgid);
    const t = personOrgs.find((oz) => oz.orgId === oo.id);

    // console.log("\n\n t: " + t);

    if (!t) showOrgs.push(oo);
  }

  //console.log("\n\n orgs: " + JSON.stringify(orgs));
  //console.log("\n\n showOrgs: " + JSON.stringify(showOrgs));
  //console.log("\n\n orgs:" + orgs.length);

  return { currentUser, person, personOrgs, showOrgs, q };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formdata = Object.fromEntries(await request.formData());

  // console.log(
  //  "\n\nperson/org link formdata?: " + JSON.stringify(formdata, null, 2)
  // );

  /*
  if (Array.isArray(formdata)) {
    let j = 0;
    for (j; j < formdata.length; j++) {
      formdata[j].title = "Needs a title";
    }
  } else {
    formdata.title = "Needs a title";
  }

   */

  const personorg = await createPersonOrg(formdata);

  // console.log(
  //   "\n\npersonOorg post link personOrg?: " + JSON.stringify(personorg, null, 2)
  // );

  if (personorg.hasOwnProperty("error")) return personorg;
  else return redirect(`/persons/${personorg.id}`);

  return {};
};

export default function PersonDetail() {
  const data = useActionData<typeof action>();
  const { currentUser, person, personOrgs, showOrgs, q } =
    useLoaderData<typeof loader>();

  const submit = useSubmit();
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  let address = blankAddress("personal");

  if (person.address != null) {
    // console.log("\n\n splitting before json " + JSON.stringify(tadd));

    address = JSON.parse(person.address);

    // console.log("\n\n splitting address " + JSON.stringify(address));
  }

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isManager = Roles.isManager(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  return (
    <div className="container-md">
      <Nav
        isAdmin={isAdmin}
        isManager={isManager}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <h1>User Detail</h1>
      <SecondaryNav
        target="persons"
        id={person.id}
        canDelete={false}
        canCreate={true}
        canEdit={true}
        canClone={true}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        backTarget={"persons"}
        what="Person"
      />
      <br />

      <h1>Person Detail</h1>

      <div className="row">
        <h6 className="col-2 align-text-top">First Name:</h6>
        <p className="col-7 lead align-text-top">{person.firstName}</p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Last Name:</h6>
        <p className="col-7 lead align-text-top">{person.lastName}</p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Email:</h6>
        <p className="col-7 lead align-text-top">
          <a href={`mailto:` + person.email}>{person.email}</a>
        </p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Phone:</h6>
        <p className="col-7 lead align-text-top">{person.phone}</p>
      </div>

      <div className="row">
        <h6 className="col-2 align-text-top">Is User Profile?</h6>
        <p className="col-7 lead align-text-top">
          {person.userId ? "Yes" : "No"}
        </p>
      </div>

      <div className="accordion-body">
        <PlainAddress
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

      <div className="bd-example">
        <h6 className="h6">Owner:</h6>
        <p className="lead">
          {person.owner.personOwners[0].firstName +
            " " +
            person.owner.personOwners[0].lastName}
        </p>
      </div>

      <h4 className="mt-xl-4">Linked Organizations</h4>

      {personOrgs != null && personOrgs.length ? (
        <div className="flex-column">
          <div className="row">
            <div className="col-sm-5">Organization</div>
            <div className="col-sm-4">Title</div>
          </div>
          {personOrgs.map((morg) => (
            <div className="row" key={morg.id}>
              <div className="col-sm-5">
                <Link
                  to={`/personOrgs/${morg.id}`}
                  className="nav-link"
                  aria-current="page"
                >
                  {morg.org.name}
                </Link>
              </div>
              <div className="col-sm-4">{morg.title}</div>
            </div>
          ))}
        </div>
      ) : (
        <i>No linked organizations</i>
      )}

      {showOrgs != null && showOrgs.length ? (
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
                  Link Organization(s)
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

                <Link
                  to={`/organizations/${person.id}/createlink`}
                  className="nav-link"
                >
                  Create &amp; Link New Organization
                </Link>

                <nav className="nav flex-column my-5">
                  <Form method="post">
                    <input type="hidden" name="personId" value={person.id} />
                    <div className="row">
                      <div className="col-sm-2">Link</div>
                      <div className="col-sm-7">Organization Name</div>
                    </div>

                    {showOrgs.map((org) => (
                      <div className="row" key={org.id}>
                        <div className="col-sm-1">
                          <input type="checkbox" name="orgId" value={org.id} />
                        </div>
                        <div className="col-sm-8">
                          <Link
                            to={`/organizations/${org.id}`}
                            className="nav-link"
                            aria-current="page"
                          >
                            {org.name}
                          </Link>
                        </div>
                      </div>
                    ))}
                    <div className="mg-3">
                      <button type="submit" className="btn btn-primary">
                        Link
                      </button>
                      <button type="cancel" className="btn btn-secondary">
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
    </div>
  );
}
