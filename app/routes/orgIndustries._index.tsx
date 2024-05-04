import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { getAllOrgIndustries } from "~/controllers/orgIndustries";
import { isAuthenticated } from "~/services/auth.server";
import { Roles } from "~/models/role";
import Nav from "~/components/nav";
import SecondaryNav from "~/components/secondarynav";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticated(request);
  if (!currentUser) return redirect("/login");

  const orgIndustries = await getAllOrgIndustries();

  return json({ currentUser, orgIndustries });
};

export default function Index() {
  const { currentUser, orgIndustries } = useLoaderData<typeof loader>();

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

      <div>
        <h1>Org Industries</h1>
      </div>
      <SecondaryNav
        target="orgIndustries"
        canDelete={false}
        canCreate={true}
        canEdit={false}
        canClone={false}
        viewLoginLog={false}
        viewDetail={false}
        showBack={true}
        showBack1={false}
        backTarget={"dashboard"}
        showBackTitle="To Dashboard"
        what="Organizational Industries"
      />
      <br />

      <nav className="nav flex-column">
        {orgIndustries.map((oi) => (
          <li key={oi.id}>
            <h5>
              <Link
                to={`/orgIndustries/${oi.id}`}
                className="nav-link"
                aria-current="page"
              >
                {oi.id}
              </Link>
            </h5>
          </li>
        ))}
      </nav>
    </div>
  );
}
