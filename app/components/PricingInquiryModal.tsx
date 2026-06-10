"use client";

import Image from "next/image";
import type { ReactNode, Ref } from "react";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { PricingPackage } from "../lib/pricing";

type PricingInquiryModalProps = {
  idPrefix?: string;
  packageInfo: PricingPackage;
  eyebrow?: string;
  title?: string;
  description?: string;
  targetLabel?: string;
  submitLabel?: string;
  successMessage?: string;
  showMedia?: boolean;
  showDetails?: boolean;
  renderTrigger: (args: {
    openModal: () => void;
    buttonRef: Ref<HTMLButtonElement>;
  }) => ReactNode;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
};

type FieldErrors = Partial<Record<keyof FormData | "contact", string>>;

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const INITIAL_DATA: FormData = {
  name: "",
  email: "",
  phone: "",
  location: "",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(data: FormData) {
  const errors: FieldErrors = {};
  const hasEmail = Boolean(data.email.trim());
  const hasPhone = Boolean(data.phone.trim());

  if (!data.name.trim()) errors.name = "Name is required.";
  if (!hasEmail && !hasPhone) {
    errors.contact = "Enter either an email address or phone number.";
  }
  if (hasEmail && !isValidEmail(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (hasPhone && data.phone.trim().length < 6) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!data.location.trim())
    errors.location = "Location to service is required.";

  return errors;
}

export function PricingInquiryModal({
  idPrefix,
  packageInfo,
  eyebrow = "Package inquiry",
  title,
  description = "Review the package details and send your inquiry to OSCOMP.",
  targetLabel = "Package name",
  submitLabel = "Request Free Layout Planning",
  successMessage = "Inquiry sent. OSCOMP will review the package request and contact you.",
  showMedia = true,
  showDetails = true,
  renderTrigger,
}: PricingInquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dialogId = `${idPrefix ? `${idPrefix}-` : ""}${packageInfo.slug}`;
  const inquiryTargetName = title ?? packageInfo.name;

  function closeModal() {
    setIsOpen(false);
    setErrors({});
    setStatus({ type: "idle", message: "" });
    openButtonRef.current?.focus();
  }

  function openModal() {
    setIsOpen(true);
    setErrors({});
    setStatus({ type: "idle", message: "" });
  }

  useEffect(() => {
    if (!isOpen) return;

    nameInputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function update<K extends keyof FormData>(name: K, value: FormData[K]) {
    setData((current) => ({ ...current, [name]: value }));
    setStatus({ type: "idle", message: "" });
    setErrors((current) => {
      if (!current[name] && !current.contact) return current;
      const next = { ...current };
      delete next[name];
      if (name === "email" || name === "phone") delete next.contact;
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "idle", message: "" });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/pricing-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          location: data.location.trim(),
          packageName: inquiryTargetName,
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Unable to send pricing inquiry.");
      }

      setData(INITIAL_DATA);
      setErrors({});
      setStatus({
        type: "success",
        message: successMessage,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send pricing inquiry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {renderTrigger({ openModal, buttonRef: openButtonRef })}

      {isOpen ? (
        <div className="inquiry-modal-backdrop" onMouseDown={closeModal}>
          <div
            aria-describedby={`pricing-package-description-${dialogId}`}
            aria-labelledby={`pricing-package-title-${dialogId}`}
            aria-modal="true"
            className="inquiry-modal pricing-package-modal"
            onMouseDown={(event) => event.stopPropagation()}
            ref={modalRef}
            role="dialog"
          >
            <div className="inquiry-modal-header pricing-package-modal-header">
              <div>
                <p className="eyebrow">{eyebrow}</p>
                <h2 id={`pricing-package-title-${dialogId}`}>
                  {inquiryTargetName}
                </h2>
                <p id={`pricing-package-description-${dialogId}`}>
                  {description}
                </p>
              </div>
              <button
                aria-label="Close package inquiry form"
                className="inquiry-modal-close"
                type="button"
                onClick={closeModal}
              >
                <span className="material-icons" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            {showMedia ? (
              <div className="pricing-package-modal-media">
                <div className="pricing-package-modal-media-frame">
                  <Image
                    src={packageInfo.imageSrc}
                    alt={packageInfo.imageAlt}
                    fill
                    sizes="(max-width: 991px) calc(100vw - 2rem), 780px"
                    className="pricing-package-modal-image"
                  />
                </div>
                <p className="pricing-package-media-note">
                  Sample layout only. Final camera placement depends on your
                  actual site and coverage needs.
                </p>
              </div>
            ) : null}

            <form
              className="quotation-form inquiry-modal-form"
              onSubmit={handleSubmit}
              noValidate
            >
              {showDetails ? (
                <details className="pricing-package-details" open={false}>
                  <summary>Full package details</summary>
                  <div className="pricing-package-detail-list">
                    {packageInfo.features.map((feature) => (
                      <div
                        key={feature.label}
                        className="pricing-package-detail-row"
                      >
                        <span>{feature.label}</span>
                        <strong>{feature.value}</strong>
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}

              <label
                className={`qf-field${errors.name ? " qf-field-error" : ""}`}
              >
                <span>Name *</span>
                <input
                  autoComplete="name"
                  maxLength={80}
                  name="name"
                  onChange={(event) => update("name", event.target.value)}
                  ref={nameInputRef}
                  type="text"
                  value={data.name}
                />
                {errors.name ? (
                  <span className="qf-error-msg">{errors.name}</span>
                ) : null}
              </label>

              <div className="quotation-form-grid">
                <label
                  className={`qf-field${errors.phone ? " qf-field-error" : ""}`}
                >
                  <span>Contact number</span>
                  <input
                    autoComplete="tel"
                    maxLength={30}
                    name="phone"
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="09xx xxx xxxx"
                    type="tel"
                    value={data.phone}
                  />
                  {errors.phone ? (
                    <span className="qf-error-msg">{errors.phone}</span>
                  ) : null}
                </label>
                <label
                  className={`qf-field${errors.email ? " qf-field-error" : ""}`}
                >
                  <span>Email</span>
                  <input
                    autoComplete="email"
                    maxLength={100}
                    name="email"
                    onChange={(event) => update("email", event.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    value={data.email}
                  />
                  {errors.email ? (
                    <span className="qf-error-msg">{errors.email}</span>
                  ) : null}
                </label>
              </div>

              {errors.contact ? (
                <div className="quotation-status quotation-status-warning">
                  {errors.contact}
                </div>
              ) : null}

              <label
                className={`qf-field${errors.location ? " qf-field-error" : ""}`}
              >
                <span>Location *</span>
                <input
                  autoComplete="address-level2"
                  maxLength={140}
                  name="location"
                  onChange={(event) => update("location", event.target.value)}
                  placeholder="City / Municipality / Site"
                  type="text"
                  value={data.location}
                />
                {errors.location ? (
                  <span className="qf-error-msg">{errors.location}</span>
                ) : null}
              </label>

              <label className="qf-field">
                <span>{targetLabel}</span>
                <input
                  type="text"
                  value={inquiryTargetName}
                  readOnly
                  aria-readonly="true"
                />
              </label>

              {status.type !== "idle" ? (
                <div
                  className={`quotation-status quotation-status-${status.type}`}
                >
                  {status.message}
                </div>
              ) : null}

              <div className="inquiry-modal-actions">
                <button
                  className="btn btn-primary shadow"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : submitLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
