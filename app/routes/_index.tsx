import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import NavNon from "~/components/navnon";
import Nav from "~/components/nav";
import { isAuthenticatedNoRedirect } from "~/services/auth.server";
import { useLoaderData } from "@remix-run/react";
import { Roles } from "~/models/role";

export const meta: MetaFunction = () => {
  return [
    { title: "NSF CRM" },
    { name: "description", content: "Welcome to NSF CRM!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await isAuthenticatedNoRedirect(request);

  console.log("\n\n index currentUser: " + JSON.stringify(currentUser));
  return { currentUser };
};

export default function Index() {
  const { currentUser } = useLoaderData<typeof loader>();

  if (currentUser) {
    const isAdmin = Roles.isAdmin(currentUser.role);
    const isLoggedIn = currentUser.isLoggedIn;
    return (
      <>
        <Nav
          isAdmin={isAdmin}
          isLoggedIn={isLoggedIn}
          name={currentUser.firstName + " " + currentUser.lastName}
        />

        <h1>Welcome to NSF CRM</h1>
        <p>
          Building a CRM as an experiment using Remix, Remix Auth, React,
          SQLite, Prisma, Zod, Resend
        </p>
      </>
    );
  } else {
    return (
      <>
        <NavNon showRegister={true} showLogin={true} />

        <h1>Welcome to NSF CRM</h1>
        <p>
          Building a CRM as an experiment using Remix, Remix Auth, React,
          SQLite, Prisma, Zod, Resend
        </p>
      </>
    );
  }
}
