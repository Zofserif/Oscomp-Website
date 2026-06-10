"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { PricingInquiryModal } from "./PricingInquiryModal";
import type { PricingPackage } from "../lib/pricing";

type PricingPackagesSectionProps = {
  packages: PricingPackage[];
};

const MOBILE_BREAKPOINT = "(max-width: 991.98px)";
const customSolutionPackage: PricingPackage = {
  slug: "custom-solution",
  name: "Custom Solution",
  subtitle: "Tailored coverage for your actual site",
  price: "",
  imageSrc: "/assets/img/pricing/standard-system-layout.png",
  imageAlt: "Custom CCTV solution planning",
  details: [],
  features: [],
};

export function PricingPackagesSection({
  packages,
}: PricingPackagesSectionProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const resizeRafRef = useRef<number | null>(null);
  const activeSlideIndexRef = useRef(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const featuredSlideIndex = packages.findIndex((item) => item.highlighted);
  const initialSlideIndex = featuredSlideIndex >= 0 ? featuredSlideIndex : 0;

  const getCarouselSlides = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return [] as HTMLElement[];

    return Array.from(
      carousel.querySelectorAll<HTMLElement>('[data-pricing-slide="true"]'),
    );
  }, []);

  const scrollToSlide = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const slides = getCarouselSlides();
      const slide = slides[index];
      if (!slide) return;

      const centeredLeft =
        slide.offsetLeft - (carousel.clientWidth - slide.clientWidth) / 2;
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      const targetLeft = Math.max(0, Math.min(centeredLeft, maxScrollLeft));

      carousel.scrollTo({
        left: targetLeft,
        behavior,
      });

      activeSlideIndexRef.current = index;
      setActiveSlideIndex(index);
    },
    [getCarouselSlides],
  );

  const syncActiveSlideFromScroll = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const slides = getCarouselSlides();
    if (slides.length === 0) return;

    const viewportCenter = carousel.scrollLeft + carousel.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      const distance = Math.abs(slideCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    activeSlideIndexRef.current = closestIndex;
    setActiveSlideIndex(closestIndex);
  }, [getCarouselSlides]);

  const handleCarouselScroll = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia(MOBILE_BREAKPOINT).matches) return;
    if (scrollRafRef.current !== null) return;

    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      syncActiveSlideFromScroll();
    });
  }, [syncActiveSlideFromScroll]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia(MOBILE_BREAKPOINT).matches) return;

    const frameId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollToSlide(initialSlideIndex, "auto");
      });
    });
    const timeoutId = window.setTimeout(() => {
      scrollToSlide(initialSlideIndex, "auto");
    }, 180);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [initialSlideIndex, scrollToSlide]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);

    function handleViewportChange() {
      if (!mediaQuery.matches) return;
      if (resizeRafRef.current !== null) return;

      resizeRafRef.current = window.requestAnimationFrame(() => {
        resizeRafRef.current = null;
        const targetIndex = Math.max(
          0,
          Math.min(activeSlideIndexRef.current, packages.length - 1),
        );
        scrollToSlide(targetIndex, "auto");
      });
    }

    handleViewportChange();
    mediaQuery.addEventListener("change", handleViewportChange);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
      if (resizeRafRef.current !== null) {
        window.cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
    };
  }, [packages.length, scrollToSlide]);

  useEffect(() => {
    return () => {
      if (typeof window === "undefined") return;
      if (scrollRafRef.current === null) return;
      window.cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    };
  }, []);

  function renderCard(item: PricingPackage, variant: "desktop" | "mobile") {
    return (
      <PricingInquiryModal
        key={item.slug}
        idPrefix={`pricing-${variant}`}
        packageInfo={item}
        renderTrigger={({ openModal, buttonRef }) => (
          <article
            data-pricing-slide={variant === "mobile" ? "true" : undefined}
            className={`pricing-package-card${item.highlighted ? " pricing-package-card-highlighted" : ""}`}
            role="button"
            tabIndex={0}
            onClick={openModal}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openModal();
              }
            }}
          >
            <div className="pricing-package-card-top">
              {item.highlighted ? (
                <p className="pricing-package-badge">Most Popular</p>
              ) : (
                <span
                  className="pricing-package-badge pricing-package-badge-spacer"
                  aria-hidden="true"
                />
              )}
              <div className="pricing-package-card-heading">
                <h2>{item.name}</h2>
                <p className="pricing-package-subtitle">{item.subtitle}</p>
              </div>
            </div>

            <div className="pricing-package-copy">
              <ul className="check-list pricing-package-checks">
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>

              <div className="pricing-package-footer">
                <p className="pricing-package-price">
                  <span>Starting from</span>
                  <strong>{item.price}</strong>
                </p>
                <button
                  ref={buttonRef}
                  className="btn btn-outline-primary pricing-card-cta"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openModal();
                  }}
                >
                  See What’s Included
                </button>
              </div>
            </div>
          </article>
        )}
      />
    );
  }

  return (
    <div className="pricing-package-selector">
      <div
        className="pricing-package-desktop-grid"
        aria-label="CCTV pricing packages"
      >
        {packages.map((item) => renderCard(item, "desktop"))}
      </div>

      <div className="pricing-package-mobile-shell">
        <div
          ref={carouselRef}
          className="pricing-package-carousel"
          onScroll={handleCarouselScroll}
          aria-label="CCTV pricing packages carousel"
        >
          {packages.map((item) => renderCard(item, "mobile"))}
        </div>

        <div
          className="pricing-package-dots"
          aria-label="Pricing card navigation"
        >
          {packages.map((item, index) => (
            <button
              key={`${item.slug}-dot`}
              type="button"
              onClick={() => scrollToSlide(index, "smooth")}
              aria-label={`View ${item.name}`}
              className={`pricing-package-dot${activeSlideIndex === index ? " is-active" : ""}`}
            />
          ))}
        </div>
      </div>

      <PricingInquiryModal
        idPrefix="pricing-custom"
        packageInfo={customSolutionPackage}
        eyebrow="Custom solution inquiry"
        title="Custom Solution"
        description="Tell OSCOMP about your site and coverage needs for a custom CCTV setup."
        targetLabel="Inquiry type"
        submitLabel="Request a Custom Solution"
        successMessage="Inquiry sent. OSCOMP will review your custom solution request and contact you."
        showMedia={false}
        showDetails={false}
        renderTrigger={({ openModal, buttonRef }) => (
          <div className="pricing-custom-cta">
            <button
              ref={buttonRef}
              className="btn btn-primary shadow pricing-custom-cta-button"
              type="button"
              onClick={openModal}
            >
              I want a Custom Solution
            </button>
          </div>
        )}
      />
    </div>
  );
}
