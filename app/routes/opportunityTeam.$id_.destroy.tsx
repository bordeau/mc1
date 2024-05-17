import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { isAuthenticated } from "~/services/auth.server";
import SecondaryNav from "~/components/secondarynav";
import React from "react";

import { destroyOppTeam, getOppTeamById } from "~/controllers/opportunityTeam";
import NavBar from "~/components/nav";
import { PAGE_MARGIN } from "~/models/misc";

const target = "opportunityTeam";
const what = "Opportunity Team Member";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing org type ID param");

  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  let item = await getOppTeamById(params.id);

  let data;
  if (item.user != null) {
    data = {
      id: params.id,
      name: item.opportunity.name,
      role: item.role,
      firstName: item.user.firstName,
      lastName: item.user.lastName,
      userId: item.userId,
      opportunityId: item.opportunityId,
      type: "Internal",
    };
  }
  //
  else if (item.person != null) {
    data = {
      id: params.id,
      name: item.opportunity.name,
      role: item.role,
      firstName: item.person.firstName,
      lastName: item.person.lastName,
      personId: item.personId,
      opportunityId: item.opportunityId,
      type: "External",
    };
  }

  //console.log(
  //  "\n\n delete org type loader:" + JSON.stringify(item, null, 2)
  //);

  return { currentUser, data };
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  // console.log("\n\n delete form data: " + JSON.stringify(formData));
  const id = formData.id;
  const opportunityId = formData.opportunityId;
  if (formData.button === "yes") {
    await destroyOppTeam(id);
    return redirect("/opportunity/" + opportunityId);
  } else {
    return redirect("/" + target + "/" + id);
  }
}

export default function opportunitySourcesId_Destroy() {
  const { currentUser, data } = useLoaderData<typeof loader>();

  if (data === null) {
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
            target={target}
            canDelete={false}
            canCreate={false}
            canEdit={true}
            canClone={false}
            viewLoginLog={false}
            viewDetail={false}
            showBack={true}
            backTarget={target}
            what={what}
          />
          <br />

          <p>
            The {what} is referenced by an Opportunity, to delete you will need
            to remove all references
          </p>
        </div>
      </>
    );
  } else
    return (
      <>
        <NavBar
          role={currentUser.role}
          isLoggedIn={currentUser.isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />
        <div className="mx-1">
          <h1>Opportunity Team Delete</h1>
          <SecondaryNav
            target={target}
            canDelete={false}
            canCreate={false}
            canEdit={true}
            canClone={false}
            viewLoginLog={false}
            viewDetail={false}
            showBack={true}
            backTarget={target}
            what={what}
          />
          <br />
          <Form key="orgTypeIddelete" id="orgTypeIddelete-form" method="post">
            <input type="hidden" value={data.id} name="id" />
            <input
              type="hidden"
              value={data.opportunityId}
              name="opportunityId"
            />
            <div className="mg-3">
              <label className="form-label">
                Are you sure you want to delete {what}?
              </label>
              <div className="bd-example">
                <div className="row">
                  <h6 className="col-2 align-text-top">Opportunity</h6>
                  <p className="col-7 lead align-text-top">{data.name}</p>
                </div>

                <div className="row">
                  <h6 className="col-2 align-text-top">Team Member Name</h6>
                  <p className="col-7 lead align-text-top">
                    {data.firstName + " " + data.lastName}
                  </p>
                </div>

                <div className="row">
                  <h6 className="col-2 align-text-top">Type</h6>
                  <p className="col-7 lead align-text-top">{data.type}</p>
                </div>

                <div className="row">
                  <h6 className="col-2 align-text-top">Role</h6>
                  <p className="col-7 lead align-text-top">{data.role}</p>
                </div>
              </div>
            </div>
            <div className="mg-3">
              <button
                type="submit"
                className="btn btn-primary"
                name="button"
                value="yes"
              >
                Yes
              </button>
              <button
                type="submit"
                className="btn btn-secondary"
                name="button"
                value="no"
              >
                No
              </button>
            </div>
          </Form>
        </div>
      </>
    );
}
