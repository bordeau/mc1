import { Link } from "@remix-run/react";
import React from "react";

export default function Openregistrations(params) {
  // console.log("\n\n AFTER p:" + p + " pp:" + (pp ? "YES" : "NO"));

  // console.log("\n\n params: " + JSON.stringify(params, null, 2));
  const registrations = params.registrations;
  return (
    <div className="border border-2">
      <h3>Open Registrations</h3>

      {registrations.map((u) => (
        <div className="row" key={u.id}>
          <div className="col">
            <Link
              to={`/registrations/${u.id}`}
              className="nav-link"
              aria-current="page"
            >
              {u.firstName + " " + u.lastName}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
