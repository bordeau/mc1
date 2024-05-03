import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { authenticator, isAuthenticated } from "~/services/auth.server";
import { useLoaderData } from "react-router";

import { Roles } from "~/models/role";

import LoginPage from "~/routes/login";
import Nav from "~/components/nav";
import { getSession } from "~/services/session.server";
import Registrations from "~/routes/registrations._index";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  const currentUser = await isAuthenticated(request);

  // console.log("\n\n dashboard loader uu: " + JSON.stringify(currentUser));

  if (currentUser) return { currentUser };
  else return redirect("/login");
}

export default function Dashboard() {
  const { currentUser } = useLoaderData<typeof loader>();

  const isAdmin = Roles.isAdmin(currentUser.role);
  const isLoggedIn = currentUser.isLoggedIn;

  if (isLoggedIn) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <Nav
          isAdmin={isAdmin}
          isLoggedIn={isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />

        <h1>Dashboard</h1>

        <p>hi</p>
      </div>
    );
  } else {
    <LoginPage />;
  }
}
