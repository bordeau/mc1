import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" });
}

export default function Logout() {
  return <></>;
}
