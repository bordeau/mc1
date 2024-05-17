import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { isAuthenticated } from "~/services/auth.server";
import { useLoaderData } from "react-router";
import Nav from "~/components/nav";
import NavBar from "~/components/nav";

import { Roles } from "~/models/role";
import Openregistrations from "~/components/dashboard/openregistrations";

import { getAllInProcessingRegistrations } from "~/controllers/registrations";
import Mypersons from "~/components/dashboard/mypersons";
import Myorgs from "~/components/dashboard/myorgs";
import { getActivePersonsByOwner } from "~/controllers/persons";
import { getActiveOrgsByOwner } from "~/controllers/orgs";
import {
  getActiveLeadsByOwner,
  getActiveOppsByOwner,
} from "~/controllers/opps";
import Myopps from "~/components/dashboard/myopps";
import Myleads from "~/components/dashboard/myleads";
import { PAGE_MARGIN } from "~/models/misc";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await isAuthenticated(request);
  if (!currentUser.isLoggedIn) return redirect("/login");
  /*
  console.log(
    "\n\n dashboard loader after redirect uu: " + JSON.stringify(currentUser)
  );
*/
  const [registrations, persons, orgs, opps, leads] = await Promise.all([
    getAllInProcessingRegistrations(),
    getActivePersonsByOwner(currentUser.id),
    getActiveOrgsByOwner(currentUser.id),
    getActiveOppsByOwner(currentUser.id),
    getActiveLeadsByOwner(currentUser.id),
  ]);

  return { currentUser, registrations, persons, orgs, opps, leads };
}

export default function Dashboard() {
  const { currentUser, registrations, persons, orgs, opps, leads } =
    useLoaderData<typeof loader>();

  const isAdmin = Roles.isAdmin(currentUser.role);

  return (
    <>
      <NavBar
        role={currentUser.role}
        isLoggedIn={currentUser.isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />

      <div className={PAGE_MARGIN}>
        <h1>Dashboard</h1>
        <br />

        {isAdmin ? <Openregistrations registrations={registrations} /> : <></>}
        <Myorgs orgs={orgs} />
        <Mypersons persons={persons} />
        <Myleads opps={leads} />
        <Myopps opps={opps} />
      </div>
    </>
  );
}
