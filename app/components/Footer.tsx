import Link from "next/link";
import { site } from "../lib/site";

export function Footer() {
  return (
    <footer className="bg-primary-gradient">
      <div className="container py-4 py-lg-5">
        <div className="row justify-content-center">
          <div className="col-sm-4 col-md-3 text-center text-lg-start d-flex flex-column item">
            <h2 className="fs-6 fw-bold">Services</h2>
            <ul className="list-unstyled">
              <li>
                <Link href="/services/cctv-consultation-and-installation">
                  CCTV Consultation &amp; Installation
                </Link>
              </li>
              <li>
                <Link href="/services/attendance-and-access-control">
                  Attendance &amp; Access Control
                </Link>
              </li>
              <li>
                <Link href="/services/electronic-device-and-accessories-repairs">
                  Computer Repairs
                </Link>
              </li>
              <li>
                <Link href="/services/it-solutions">IT Solutions</Link>
              </li>
              <li>
                <Link href="/services/custom-software-solution">
                  Custom Software
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-sm-4 col-md-3 text-center text-lg-start d-flex flex-column item">
            <h2 className="fs-6 fw-bold">Company</h2>
            <ul className="list-unstyled">
              <li>
                <Link href="/projects">Projects</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 text-center text-lg-start d-flex flex-column align-items-center order-first align-items-lg-start order-lg-last item social">
            <div className="fw-bold d-flex align-items-center mb-2 footer-brand">
              <img
                className="brand-logo"
                src={site.logo}
                width="30"
                height="34"
                alt="OSCOMP logo"
              />
              <span>{site.shortName}</span>
            </div>
            <p className="text-muted copyright">
              CCTV &amp; Security Services.
            </p>
          </div>
        </div>
        <hr />
        <div className="text-muted d-flex justify-content-between align-items-center pt-3">
          <p className="mb-0">Copyright © 2022 OSCOMP IT SOLUTION</p>
          <ul className="list-inline mb-0" aria-label="Social links">
            <li className="list-inline-item">
              <span aria-label="Facebook" role="img">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="bi bi-facebook"
                  aria-hidden="true"
                >
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                </svg>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
