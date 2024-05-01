import { Link } from "@remix-run/react";
import React from "react";

export default function SecondaryNav(props) {
  // console.log("\n\n secondary nav props: " + JSON.stringify(props));

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border border-primary rounded-1 ">
      <nav className="nav flex-sm">
        {props.canCreate ? (
          <Link
            to={"/" + props.target + "/create"}
            className="nav-link"
            aria-current="page"
          >
            Create {props.what}
          </Link>
        ) : (
          " "
        )}
        {props.canEdit ? (
          <Link
            to={"/" + props.target + "/" + props.id + "/edit"}
            className="nav-link"
            aria-current="page"
          >
            Edit {props.what}
          </Link>
        ) : (
          " "
        )}
        {props.canClone ? (
          <Link
            to={"/" + props.target + "/" + props.id + "/clone"}
            className="nav-link"
            aria-current="page"
          >
            Clone {props.what}
          </Link>
        ) : (
          " "
        )}
        {props.canActivate ? (
          <Link
            to={"/" + props.target + "/" + props.id + "/activate"}
            className="nav-link"
            aria-current="page"
          >
            Activate {props.what}
          </Link>
        ) : (
          " "
        )}
        {props.canDelete ? (
          <Link
            to={"/" + props.target + "/" + props.id + "/destroy"}
            className="nav-link"
            aria-current="page"
          >
            Delete {props.what}
          </Link>
        ) : (
          " "
        )}

        {props.showBack ? (
          <Link
            to={"/" + props.backTarget}
            className="nav-link"
            aria-current="page"
          >
            {props.showBackTitle ? props.showBackTitle : "Back to list"}
          </Link>
        ) : (
          " "
        )}
      </nav>
    </nav>
  );
}
