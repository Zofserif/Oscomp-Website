"use client";

import { FormEvent, useCallback, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const serviceOptions = [
  {
    value: "CCTV Sales and Installation",
    label: "CCTV Sales & Installation",
    icon: "videocam",
  },
  {
    value: "CCTV Maintenance and Troubleshooting",
    label: "CCTV Maintenance & Repair",
    icon: "build",
  },
  {
    value: "Security Camera Setup",
    label: "Security Camera Setup",
    icon: "security",
  },
  {
    value: "Computer Repairs",
    label: "Computer Repairs",
    icon: "computer",
  },
  {
    value: "IT Solutions",
    label: "IT Solutions",
    icon: "cloud",
  },
  {
    value: "Networking and Cybersecurity",
    label: "Networking & Cybersecurity",
    icon: "lock",
  },
  {
    value: "Other Technology Support",
    label: "Other Tech Support",
    icon: "more_horiz",
  },
];

const propertyTypes = [
  "Home / Residential",
  "Office / Commercial",
  "Warehouse / Industrial",
  "Retail / Store",
  "School / Institution",
  "Other",
];

const TOTAL_STEPS = 3;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  propertyType: string;
  cameraCount: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof FormData, string>>;

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const INITIAL: FormData = {
  name: "",
  phone: "",
  email: "",
  service: "",
  location: "",
  propertyType: "",
  cameraCount: "",
  message: "",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function validateField(name: keyof FormData, value: string): string {
  const v = value.trim();
  switch (name) {
    case "name":
      return !v ? "Name is required" : "";
    case "phone":
      if (!v) return "Phone is required";
      if (v.length < 6) return "Enter a valid phone number";
      return "";
    case "email":
      if (!v) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email";
      return "";
    case "service":
      return !v ? "Please select a service" : "";
    case "location":
      return !v ? "Location is required" : "";
    case "propertyType":
    case "cameraCount":
    case "message":
      return "";
    default:
      return "";
  }
}

function buildMessage(data: FormData): string {
  const parts: string[] = [];
  if (data.propertyType) parts.push(`Property: ${data.propertyType}`);
  if (data.message.trim()) parts.push(`Notes: ${data.message.trim()}`);
  return parts.join("\n") || "No additional details provided.";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function QuotationForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Set<keyof FormData>>(new Set());
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  /* ---- field helpers ---- */

  const update = useCallback(
    <K extends keyof FormData>(name: K, value: string) => {
      setData((prev) => ({ ...prev, [name]: value }));
      if (touched.has(name)) {
        setErrors((prev) => {
          const err = validateField(name, value);
          if (!err) {
            const next = { ...prev };
            delete next[name];
            return next;
          }
          return { ...prev, [name]: err };
        });
      }
    },
    [touched],
  );

  const blur = useCallback((name: keyof FormData) => {
    setTouched((prev) => new Set(prev).add(name));
    setData((prev) => {
      const err = validateField(name, prev[name]);
      setErrors((prevErrs) =>
        err
          ? { ...prevErrs, [name]: err }
          : (() => {
              const next = { ...prevErrs };
              delete next[name];
              return next;
            })(),
      );
      return prev;
    });
  }, []);

  /* ---- step validation ---- */

  const stepFields: Record<number, (keyof FormData)[]> = {
    1: ["name", "phone", "email"],
    2: ["service", "location"],
    3: [],
  };

  function validateStep(s: number): boolean {
    const fields = stepFields[s] ?? [];
    const newErrors: FieldErrors = {};
    let valid = true;
    for (const f of fields) {
      const err = validateField(f, data[f]);
      if (err) {
        newErrors[f] = err;
        valid = false;
      }
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    // mark all step fields as touched
    setTouched((prev) => {
      const next = new Set(prev);
      fields.forEach((f) => next.add(f));
      return next;
    });
    return valid;
  }

  function nextStep() {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
  }

  /* ---- submit ---- */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const payload = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      service: data.service,
      location: data.location.trim(),
      message: buildMessage(data),
    };

    try {
      const response = await fetch("/api/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to send inquiry.");
      }

      formRef.current?.reset();
      setData(INITIAL);
      setStep(1);
      setTouched(new Set());
      setErrors({});
      setStatus({
        type: "success",
        message:
          "Inquiry sent! OSCOMP will review the details and get back to you.",
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

  /* ---- render helpers ---- */

  function fieldClass(name: keyof FormData) {
    return `qf-field${errors[name] ? " qf-field-error" : ""}`;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Enter" && step < TOTAL_STEPS) {
      event.preventDefault();
      nextStep();
    }
  }

  return (
    <form
      className="quotation-form"
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      ref={formRef}
      noValidate
    >
      {/* ------- Progress bar ------- */}
      <div
        className="qf-progress"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
      >
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`qf-step-dot${i + 1 <= step ? " active" : ""}`}
            aria-current={i + 1 === step ? "step" : undefined}
          >
            <span className="qf-step-num">{i + 1}</span>
          </div>
        ))}
        <div className="qf-progress-track">
          <div
            className="qf-progress-fill"
            style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
          />
        </div>
      </div>

      <p className="qf-step-label">
        Step {step} of {TOTAL_STEPS}
        {step === 1 && " — Contact info"}
        {step === 2 && " — Service & location"}
        {step === 3 && " — Project details"}
      </p>

      {/* ------- Step 1: Contact ------- */}
      {step === 1 && (
        <div className="qf-step">
          <div className="quotation-form-grid">
            <label className={fieldClass("name")}>
              <span>Full name *</span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={80}
                placeholder="e.g. Juan Dela Cruz"
                value={data.name}
                onChange={(e) => update("name", e.target.value)}
                onBlur={() => blur("name")}
              />
              {errors.name && (
                <span className="qf-error-msg">{errors.name}</span>
              )}
            </label>
            <label className={fieldClass("phone")}>
              <span>Phone number *</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                minLength={6}
                maxLength={30}
                placeholder="e.g. 0912 345 6789"
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
                onBlur={() => blur("phone")}
              />
              {errors.phone && (
                <span className="qf-error-msg">{errors.phone}</span>
              )}
            </label>
          </div>
          <label className={fieldClass("email")}>
            <span>Email address *</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={100}
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              onBlur={() => blur("email")}
            />
            {errors.email && (
              <span className="qf-error-msg">{errors.email}</span>
            )}
          </label>
          <div className="qf-step-actions">
            <button
              type="button"
              className="btn btn-primary shadow"
              onClick={nextStep}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ------- Step 2: Service & Location ------- */}
      {step === 2 && (
        <div className="qf-step">
          <fieldset className="qf-service-group">
            <legend className="qf-legend">
              What service do you need? <span aria-hidden="true">*</span>
            </legend>
            {errors.service && (
              <span
                className="qf-error-msg"
                style={{ marginBottom: "0.5rem", display: "block" }}
              >
                {errors.service}
              </span>
            )}
            <div className="qf-service-cards">
              {serviceOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={`qf-service-card${data.service === opt.value ? " active" : ""}`}
                  onClick={() => {
                    update("service", opt.value);
                    if (errors.service) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.service;
                        return next;
                      });
                    }
                  }}
                >
                  <span className="material-icons qf-service-icon">
                    {opt.icon}
                  </span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
            {/* Hidden select for native validation + form data */}
            <select
              name="service"
              required
              value={data.service}
              onChange={(e) => update("service", e.target.value)}
              onBlur={() => blur("service")}
              style={{ display: "none" }}
              tabIndex={-1}
              aria-hidden="true"
            >
              <option value="" disabled>
                Select service
              </option>
              {serviceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.value}
                </option>
              ))}
            </select>
          </fieldset>

          <label
            className={fieldClass("location")}
            style={{ marginTop: "1.25rem" }}
          >
            <span>Project location *</span>
            <input
              name="location"
              type="text"
              autoComplete="address-level1"
              required
              maxLength={140}
              placeholder="City, town, or barangay"
              value={data.location}
              onChange={(e) => update("location", e.target.value)}
              onBlur={() => blur("location")}
            />
            {errors.location && (
              <span className="qf-error-msg">{errors.location}</span>
            )}
          </label>

          <div className="qf-step-actions">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={prevStep}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary shadow"
              onClick={nextStep}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ------- Step 3: Project Details ------- */}
      {step === 3 && (
        <div className="qf-step">
          {/* Property type */}
          <fieldset className="qf-service-group">
            <legend className="qf-legend">Property type</legend>
            <div className="qf-property-cards">
              {propertyTypes.map((propertyType) => (
                <button
                  type="button"
                  key={propertyType}
                  className={`qf-service-card${data.propertyType === propertyType ? " active" : ""}`}
                  aria-pressed={data.propertyType === propertyType}
                  onClick={() =>
                    update(
                      "propertyType",
                      data.propertyType === propertyType ? "" : propertyType,
                    )
                  }
                >
                  <span>{propertyType}</span>
                </button>
              ))}
            </div>
            <input
              type="hidden"
              name="propertyType"
              value={data.propertyType}
            />
          </fieldset>

          {/* Free-text notes */}
          <label className="qf-field">
            <span>Additional notes</span>
            <textarea
              name="message"
              rows={5}
              maxLength={1000}
              placeholder="Describe the site, security concerns, camera preferences, or anything else that helps us prepare."
              value={data.message}
              onChange={(e) => update("message", e.target.value)}
            />
            <span className="qf-char-count">{data.message.length}/1000</span>
          </label>

          <div className="qf-step-actions">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={prevStep}
            >
              Back
            </button>
            <button
              className="btn btn-primary shadow"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Sending...
                </>
              ) : (
                "Send inquiry"
              )}
            </button>
          </div>
        </div>
      )}

      {/* ------- Status messages ------- */}
      {status.type !== "idle" && (
        <p
          className={`quotation-status quotation-status-${status.type}`}
          role="status"
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
