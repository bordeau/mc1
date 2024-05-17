import {
  type ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
// existing imports

import { isAuthenticated } from "~/services/auth.server";

import SecondaryNav from "~/components/secondarynav";
import React from "react";
import { getOppTeamById, updateOppTeam } from "~/controllers/opportunityTeam";
import NavBar from "~/components/nav";
import { PAGE_MARGIN } from "~/models/misc";

const target = "opportunityTeam";
const what = "Opportunity Team Member";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  invariant(params.id, "Missing id param");

  const [item] = await Promise.all([getOppTeamById(params.id)]);

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

  // console.log("\n\n opportunityTeam item: " + JSON.stringify(item, null, 2));

  if (!item) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ currentUser, data });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  /*
  console.log(
    "\n\oppTeam edit formdata?: " + JSON.stringify(formData, null, 2)
  );
*/
  const item = await updateOppTeam(formData);

  //console.log(
  //  "\n\n oppTeam edit post action: " + JSON.stringify(item, null, 2)
  // );

  if (item.hasOwnProperty("error")) return item;
  // else return redirect(`/opportunitySources/${item.id}`);
  else return redirect("/" + target + "/" + item.id);
};

export default function opportunityTeamId() {
  const { currentUser, data } = useLoaderData<typeof loader>();

  return (
    <>
      <NavBar
        role={currentUser.role}
        isLoggedIn={currentUser.isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />
      <div className={PAGE_MARGIN}>
        <h1>{what} Detail</h1>
        <SecondaryNav
          target={target}
          id={data.id}
          canDelete={true}
          canCreate={false}
          canEdit={false}
          canClone={false}
          viewLoginLog={false}
          viewDetail={false}
          showBack={true}
          backTarget={"opportunityTeam/" + data.id}
          showBackTitle={"Back to Detail"}
          what={what}
        />
        <br />

        <div className="bd-example">
          <Form method="post">
            <input type="hidden" value={data.id} name="id" />
            <input
              type="hidden"
              value={data.opportunityId}
              name="opportunityId"
            />
            {data.type == "Internal" ? (
              <input type="hidden" value={data.userId} name="userId" />
            ) : (
              <input type="hidden" value={data.personId} name="personId" />
            )}
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
              <div className="col-sm-6">
                <input
                  name="role"
                  type="text"
                  placeholder="Role"
                  className="form-control"
                  defaultValue={data.role}
                />
              </div>
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
      </div>
    </>
  );
}
