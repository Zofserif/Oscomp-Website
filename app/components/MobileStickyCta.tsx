"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function MobileStickyCta() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const heroCta = document.querySelector(".hero-actions .hero-primary-cta");

    if (!heroCta) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(heroCta);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`mobile-sticky-cta${isVisible ? " is-visible" : ""}`}
      aria-hidden={!isVisible}
    >
      <Link className="mobile-sticky-cta-link" href="/quotation">
        <span>Get Free Security Consultation</span>
        <span className="material-icons" aria-hidden="true">
          arrow_forward
        </span>
      </Link>
    </div>
  );
}
