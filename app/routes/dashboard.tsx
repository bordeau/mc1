import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { isAuthenticated } from "~/services/auth.server";
import { useLoaderData } from "react-router";
import Nav from "~/components/nav";

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

  if (currentUser)
    return { currentUser, registrations, persons, orgs, opps, leads };
  else return redirect("/login");
}

export default function Dashboard() {
  const { currentUser, registrations, persons, orgs, opps, leads } =
    useLoaderData<typeof loader>();

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Nav
        isAdmin={isAdmin}
        isLoggedIn={isLoggedIn}
        name={currentUser.firstName + " " + currentUser.lastName}
      />

      <h1>Dashboard</h1>

      {isAdmin ? <Openregistrations registrations={registrations} /> : <></>}
      <Myorgs orgs={orgs} />
      <Mypersons persons={persons} />
      <Myleads opps={leads} />
      <Myopps opps={opps} />
    </div>
  );
}
