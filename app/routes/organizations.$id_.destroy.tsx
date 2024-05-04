import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { destroyOrg, getOrgById } from "~/controllers/orgs";
import { isAuthenticated } from "~/services/auth.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.orgId, "Missing org Id param");
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const id = Number(params.orgId);
  const org = await getOrgById(id);

  if (!org) {
    throw new Response("Not Found", { status: 404 });
  }

  return org;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  console.log("\n\n delete form data: " + JSON.stringify(formData));
  const orgId = formData.org_id;

  if (formData.button === "yes") {
    console.log("\n\ndeleted org:" + orgId + "\n\n");
    await destroyOrg(Number(orgId));
    return redirect("/organizations");
  }

  return redirect("/organizations/" + orgId);
}

export default function DestroyOrg() {
  const org = useLoaderData<typeof loader>();
  return (
    <>
      <Form key="persondelete" id="persondelete-form" method="post">
        <input type="hidden" name="org_id" value={org.id} />

        <div className="mg-3">
          <label className="form-label">
            Are you sure you want to delete org: {org.name}?
          </label>
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
    </>
  );
}
