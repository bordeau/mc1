import { Link, useNavigate } from "@remix-run/react";
import React from "react";

export default function SecondaryNav(props) {
  // console.log("\n\n secondary nav props: " + JSON.stringify(props));

  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border border-primary rounded-1 ">
      <nav className="nav flex-sm">
        {props.createLead ? (
          <Link
            to={"/" + props.target + "/create?l=lead"}
            className="nav-link"
            aria-current="page"
          >
            Create Lead
          </Link>
        ) : (
          " "
        )}

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
            to={
              "/" +
              props.target +
              "/" +
              props.id +
              "/destroy" +
              (props.re != undefined
                ? "?re=" + props.re + "&ret" + props.ret
                : "")
            }
            className="nav-link"
            aria-current="page"
          >
            Delete {props.what}
          </Link>
        ) : (
          " "
        )}
        {props.viewLoginLog ? (
          <Link
            to={"/" + props.target + "/" + props.id + "?log=yes"}
            className="nav-link"
            aria-current="page"
          >
            View Login Log for {props.what}
          </Link>
        ) : (
          " "
        )}

        {props.viewDetail ? (
          <Link
            to={"/" + props.target + "/" + props.id}
            className="nav-link"
            aria-current="page"
          >
            View Detail {props.what}
          </Link>
        ) : (
          " "
        )}

        {props.reOrder ? (
          <Link
            to={"/" + props.target + "/reOrder"}
            className="nav-link"
            aria-current="page"
          >
            Re-order {props.what}s
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

        {props.showBack1 ? (
          <Link
            to={"/" + props.backTarget}
            onClick={() => {
              navigate(-1);
            }}
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
