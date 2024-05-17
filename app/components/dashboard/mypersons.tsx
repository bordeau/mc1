import { Link } from "@remix-run/react";
import React from "react";

export default function Mypersons(params) {
  // console.log("\n\n AFTER p:" + p + " pp:" + (pp ? "YES" : "NO"));

  // console.log("\n\n params: " + JSON.stringify(params, null, 2));
  const persons = params.persons;
  return (
    <div className="border border-2">
      <h3>My People</h3>

      <p>maybe shows 5 most recent??</p>

      {persons.map((u) => (
        <div className="row" key={u.id}>
          <div className="col">
            <Link
              to={`/persons/${u.id}`}
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
