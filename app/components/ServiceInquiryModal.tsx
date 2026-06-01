"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ServiceInquiryModalProps = {
  serviceCategory: string;
  serviceTitle: string;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  propertyType: string;
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
  propertyType: "",
};

const propertyTypes = ["Business-use", "Home-use"];

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
  if (!data.location.trim()) errors.location = "Location to service is required.";
  if (!data.propertyType) errors.propertyType = "Select a property type.";

  return errors;
}

export function ServiceInquiryModal({
  serviceCategory,
  serviceTitle,
}: ServiceInquiryModalProps) {
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

  function closeModal() {
    setIsOpen(false);
    setErrors({});
    setStatus({ type: "idle", message: "" });
    openButtonRef.current?.focus();
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
      const response = await fetch("/api/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          location: data.location.trim(),
          propertyType: data.propertyType,
          service: serviceCategory,
          category: serviceCategory,
          message: `Service page inquiry for ${serviceTitle}`,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to send inquiry.");
      }

      setData(INITIAL_DATA);
      setErrors({});
      setStatus({
        type: "success",
        message: "Inquiry sent. OSCOMP will review the details and contact you.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to send inquiry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        className="btn btn-primary shadow"
        type="button"
        onClick={() => setIsOpen(true)}
        ref={openButtonRef}
      >
        Inquire Now
      </button>

      {isOpen ? (
        <div className="inquiry-modal-backdrop" onMouseDown={closeModal}>
          <div
            aria-describedby="service-inquiry-description"
            aria-labelledby="service-inquiry-title"
            aria-modal="true"
            className="inquiry-modal"
            onMouseDown={(event) => event.stopPropagation()}
            ref={modalRef}
            role="dialog"
          >
            <div className="inquiry-modal-header">
              <div>
                <p className="eyebrow">Service inquiry</p>
                <h2 id="service-inquiry-title">{serviceTitle}</h2>
                <p id="service-inquiry-description">
                  Send your details and OSCOMP will review this service request.
                </p>
              </div>
              <button
                aria-label="Close inquiry form"
                className="inquiry-modal-close"
                type="button"
                onClick={closeModal}
              >
                <span className="material-icons" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <form className="quotation-form inquiry-modal-form" onSubmit={handleSubmit} noValidate>
              <label className={`qf-field${errors.name ? " qf-field-error" : ""}`}>
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
                {errors.name ? <span className="qf-error-msg">{errors.name}</span> : null}
              </label>

              <div className="quotation-form-grid">
                <label className={`qf-field${errors.email ? " qf-field-error" : ""}`}>
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
                <label className={`qf-field${errors.phone ? " qf-field-error" : ""}`}>
                  <span>Phone</span>
                  <input
                    autoComplete="tel"
                    maxLength={30}
                    name="phone"
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="0912 345 6789"
                    type="tel"
                    value={data.phone}
                  />
                  {errors.phone ? (
                    <span className="qf-error-msg">{errors.phone}</span>
                  ) : null}
                </label>
              </div>
              {errors.contact ? (
                <span className="qf-error-msg">{errors.contact}</span>
              ) : null}

              <label className={`qf-field${errors.location ? " qf-field-error" : ""}`}>
                <span>Location to Service *</span>
                <input
                  autoComplete="address-level1"
                  maxLength={140}
                  name="location"
                  onChange={(event) => update("location", event.target.value)}
                  placeholder="City, town, or barangay"
                  type="text"
                  value={data.location}
                />
                {errors.location ? (
                  <span className="qf-error-msg">{errors.location}</span>
                ) : null}
              </label>

              <fieldset className="qf-service-group">
                <legend className="qf-legend">
                  Property type <span aria-hidden="true">*</span>
                </legend>
                <div className="qf-property-cards inquiry-property-cards">
                  {propertyTypes.map((propertyType) => (
                    <button
                      aria-pressed={data.propertyType === propertyType}
                      className={`qf-service-card${data.propertyType === propertyType ? " active" : ""}`}
                      key={propertyType}
                      onClick={() => update("propertyType", propertyType)}
                      type="button"
                    >
                      <span>{propertyType}</span>
                    </button>
                  ))}
                </div>
                {errors.propertyType ? (
                  <span className="qf-error-msg">{errors.propertyType}</span>
                ) : null}
              </fieldset>

              <label className="qf-field">
                <span>Service category</span>
                <input readOnly value={serviceCategory} />
              </label>

              {status.type !== "idle" ? (
                <p
                  className={`quotation-status quotation-status-${status.type}`}
                  role="status"
                >
                  {status.message}
                </p>
              ) : null}

              <div className="qf-step-actions inquiry-modal-actions">
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary shadow"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Sending..." : "Send inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
