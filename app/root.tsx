import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "/assets/css/bootstrap.min.css",
  },
];
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import React from "react";

export function ErrorBoundary() {
  const error = useRouteError();

  const dev = process.env.NODE_ENV === "development";

  if (isRouteErrorResponse(error) && dev) {
    return (
      <html>
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          <div className="container-md">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <div className="container-fluid">
                <a className="navbar-brand" href="about">
                  NSF CRM
                </a>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarTogglerDemo02"
                  aria-controls="navbarTogglerDemo02"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              </div>
            </nav>
            <div>
              <h1>
                {error.status} {error.statusText}
              </h1>
              <p>{error.data}</p>
            </div>
          </div>
        </body>
      </html>
    );
  } else if (error instanceof Error && dev) {
    return (
      <html>
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          <div className="container-md">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <div className="container-fluid">
                <a className="navbar-brand" href="about">
                  NSF CRM
                </a>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarTogglerDemo02"
                  aria-controls="navbarTogglerDemo02"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              </div>
            </nav>
            <div>
              <h1>Error</h1>
              <p>{error.message}</p>
              <p>The stack trace is:</p>
              <pre>{error.stack}</pre>
            </div>
          </div>
        </body>
      </html>
    );
  } else {
    return (
      <html>
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          <div className="container-md">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <div className="container-fluid">
                <a className="navbar-brand" href="about">
                  NSF CRM
                </a>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarTogglerDemo02"
                  aria-controls="navbarTogglerDemo02"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              </div>
            </nav>
            <h1>Unknown Error - contact support</h1>
          </div>
        </body>
      </html>
    );
  }
}

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script src="/assets/js/bootstrap.min.js"></script>
      </body>
    </html>
  );
}
