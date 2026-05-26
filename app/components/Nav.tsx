"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { routes, site } from "../lib/site";

export function Nav() {
  const pathname = usePathname();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const isOpen = openPathname === pathname;

  return (
    <nav
      className="navbar navbar-light navbar-expand-md fixed-top navbar-shrink py-3"
      id="mainNav"
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" href="/">
          <img
            className="brand-logo"
            src={site.logo}
            width="30"
            height="34"
            alt="OSCOMP logo"
          />
          <span>{site.shortName}</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navcol-1"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() =>
            setOpenPathname((current) => (current === pathname ? null : pathname))
          }
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div
          className={`collapse navbar-collapse${isOpen ? " show" : ""}`}
          id="navcol-1"
        >
          <ul className="navbar-nav mx-auto">
            {routes.map((route) => {
              const active = pathname === route.path;

              return (
                <li className="nav-item" key={route.path}>
                  <Link
                    className={`nav-link${active ? " active" : ""}`}
                    href={route.path}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenPathname(null)}
                  >
                    {route.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            className="btn btn-primary shadow"
            href="/quotation"
            onClick={() => setOpenPathname(null)}
          >
            Inquire Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
