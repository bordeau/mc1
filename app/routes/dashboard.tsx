import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { isAuthenticated } from "~/services/auth.server";
import { useLoaderData } from "react-router";
import Nav from "~/components/nav";

import { Roles } from "~/models/role";
import Openregistrations from "~/components/dashboard/openregistrations";

import { getAllInProcessingRegistrations } from "~/controllers/registrations";
import Mypersons from "~/components/dashboard/mypersons";
import Myorgs from "~/components/dashboard/myorgs";
import { getAllPersonsByOwner } from "~/controllers/persons";
import { getAllOrgsByOwner } from "~/controllers/orgs";

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  const currentUser = await isAuthenticated(request);

  // console.log("\n\n dashboard loader uu: " + JSON.stringify(currentUser));

  const [registrations, persons, orgs] = await Promise.all([
    getAllInProcessingRegistrations(),
    getAllPersonsByOwner(currentUser.id),
    getAllOrgsByOwner(currentUser.id),
  ]);

  if (currentUser) return { currentUser, registrations, persons, orgs };
  else return redirect("/login");
}

export default function Dashboard() {
  const { currentUser, registrations, persons, orgs } =
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
    </div>
  );
}
