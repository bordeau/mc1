import {
  type ActionFunctionArgs,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getPersonByPersonId, updatePerson } from "~/controllers/persons";
import FormAddress from "~/components/formaddress";
import { getOrgByOrgId } from "~/controllers/orgs";
import { getOrgTypeByOrgTypeId } from "~/controllers/orgTypes";
import { getPersonOrgId, updatePersonOrg } from "~/controllers/personsOrgs";
import { useActionData } from "react-router";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  console.log("\n\nperson edit org loader:" + JSON.stringify(params));
  const orgPersonId = params.personOrgId;

  const orgPerson = await getPersonOrgId(Number(orgPersonId));

  console.log("\n\n\n personOrg: " + JSON.stringify(orgPerson));

  // invariant(params.personOrgId, "Missing Org ID param");

  // const org = await getOrgByOrgId(params.orgId);
  // const orgType = await getOrgTypeByOrgTypeId(org.org_type_id);

  // console.log("\n\norg loader org:" + JSON.stringify(org));
  // console.log("\n\norg loader org type:" + JSON.stringify(orgType));
  // if (!org) {
  // throw new Response("Not Found", { status: 404 });
  // }
  return { orgPerson };
};

export async function action({ request }: ActionFunctionArgs) {
  const formdata = Object.fromEntries(await request.formData());

  console.log("\n\n updatepersonorg edit result: " + JSON.stringify(formdata));

  const orgPerson = await updatePersonOrg(formdata);

  console.log("\n\n update personOrg result: " + JSON.stringify(orgPerson));

  if (orgPerson.hasOwnProperty("error")) return orgPerson;
  else return redirect(`/personOrgs/${orgPerson.id}`);
}

export default function PersonOrgDetail() {
  const { orgPerson } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const data = useActionData<typeof action>();

  let address = {
    address_type: "organizational",
    street1: "",
    street2: "",
    city: "",
    zip: "",
    state: "",
    country: "",
  };
  if (orgPerson.address != null) {
    // console.log("\n\n splitting before json " + JSON.stringify(tadd));

    address = JSON.parse(orgPerson.address);

    // console.log("\n\n splitting address " + JSON.stringify(address));
  }

  return (
    <div className="container-md">
      <h1>Person Organization Edit</h1>

      <Form key={orgPerson.id} id="personorg-form" method="post">
        <input type="hidden" name="id" value={orgPerson.id} />

        <div className="bd-example">
          <h6 className="h6">Person:</h6>
          <p className="lead">
            {orgPerson.person.firstName} {orgPerson.person.lastName}
          </p>
        </div>

        <div className="bd-example">
          <h6 className="h6">Organization:</h6>
          <p className="lead">{orgPerson.org.name}</p>
        </div>

        <div className="mg-3">
          <label htmlFor="subOrg" className="form-label">
            Sub-Organization:
          </label>

          <input
            defaultValue={orgPerson.subOrg}
            name="subOrg"
            type="text"
            placeholder="Sub-Organization"
            className="form-control"
          />
          {data && data.error.subOrg && (
            <p className="text-danger">{data.error.subOrg._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="title" className="form-label">
            Title:
          </label>

          <input
            defaultValue={orgPerson.title}
            name="title"
            type="text"
            placeholder="Title"
            className="form-control"
          />
          {data && data.error.title && (
            <p className="text-danger">{data.error.title._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="phone" className="form-label">
            Phone:
          </label>

          <input
            defaultValue={orgPerson.phone}
            name="phone"
            type="text"
            placeholder="Phone"
            className="form-control"
          />
          {data && data.error.phone && (
            <p className="text-danger">{data.error.phone._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>

          <input
            defaultValue={orgPerson.email}
            name="email"
            type="text"
            placeholder="Email"
            className="form-control"
          />
          {data && data.error.email && (
            <p className="text-danger">{data.error.email._errors[0]}</p>
          )}
        </div>

        <div className="mg-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>

          <textarea
            defaultValue={orgPerson.description}
            name="title"
            type="text"
            placeholder="Description"
            className="form-control"
          />
          {data && data.error.description && (
            <p className="text-danger">{data.error.description._errors[0]}</p>
          )}
        </div>

        <div className="accordion-body">
          <FormAddress
            type="organizational"
            type_label="Organizational Address"
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
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            type="button"
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
