import { Link } from "@remix-run/react";
import React from "react";

export default function Myopps(params) {
  // console.log("\n\n AFTER p:" + p + " pp:" + (pp ? "YES" : "NO"));

  // console.log("\n\n params: " + JSON.stringify(params, null, 2));
  const persons = params.opps;
  return (
    <div className="border border-2">
      <h3>My Opportunities</h3>

      <p>maybe shows 5 most recent??</p>

      {persons.map((u) => (
        <div className="row" key={u.id}>
          <div className="col">
            <Link
              to={`/opportunities/${u.id}`}
              className="nav-link"
              aria-current="page"
            >
              {u.name}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
