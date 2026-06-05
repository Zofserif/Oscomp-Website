"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const serviceOptions = [
  {
    value: "CCTV / Security System Installation",
    label: "CCTV / Security System Installation",
    icon: "videocam",
  },
  {
    value: "CCTV / Security System Repair or Maintenance",
    label: "CCTV / Security System Repair or Maintenance",
    icon: "build",
  },
  {
    value: "Computer or Accessories Repair",
    label: "Computer or Accessories Repair",
    icon: "computer",
  },
  {
    value: "Attendance / Access Control System Installation",
    label: "Attendance / Access Control System Installation",
    icon: "vpn_key",
  },
  {
    value: "IT Solutions Consultation",
    label: "IT Solutions Consultation",
    icon: "cloud",
  },
  {
    value: "Custom Software Solution",
    label: "Custom Software Solution",
    icon: "code",
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
const LOCATION_SUGGESTION_LIMIT = 10;
const PHOTO_MAX_SIZE_BYTES = 2 * 1024 * 1024;
const PHOTO_ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface InquiryFormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  propertyType: string;
  cameraCount: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof InquiryFormData, string>>;

type AddressLoadStatus = "idle" | "ready" | "error";

type ProvinceAddress = {
  province_code: string;
  province_name: string;
};

type CityAddress = {
  city_code: string;
  city_name: string;
  province_code: string;
};

type BarangayAddress = {
  brgy_code: string;
  brgy_name: string;
  city_code: string;
  province_code: string;
};

type AddressSuggestion = {
  id: string;
  label: string;
  searchText: string;
};

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "warning"; message: string }
  | { type: "error"; message: string };

const INITIAL: InquiryFormData = {
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

function validateField(name: keyof InquiryFormData, value: string): string {
  const v = value.trim();
  switch (name) {
    case "name":
      return !v ? "Name is required" : "";
    case "phone":
      if (!v) return "";
      if (v.length < 6) return "Enter a valid phone number";
      return "";
    case "email":
      if (!v) return "";
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

function buildMessage(data: InquiryFormData): string {
  const parts: string[] = [];
  if (data.message.trim()) parts.push(`Notes: ${data.message.trim()}`);
  return parts.join("\n") || "No additional details provided.";
}

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function validatePhoto(file: File | null) {
  if (!file) return "";

  if (!PHOTO_ACCEPTED_TYPES.has(file.type)) {
    return "Please attach a JPEG, PNG, WebP, HEIC, or HEIF photo.";
  }

  if (file.size > PHOTO_MAX_SIZE_BYTES) {
    return "Photo must be 2 MB or smaller.";
  }

  return "";
}

async function fetchAddressJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }
  return (await response.json()) as T;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function QuotationForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<InquiryFormData>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Set<keyof InquiryFormData>>(new Set());
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [addressLoadStatus, setAddressLoadStatus] =
    useState<AddressLoadStatus>("idle");
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const addressLoadStartedRef = useRef(false);

  useEffect(() => {
    if (
      step !== 2 ||
      addressLoadStatus !== "idle" ||
      addressLoadStartedRef.current
    ) {
      return;
    }

    let isCancelled = false;
    addressLoadStartedRef.current = true;

    async function loadAddresses() {
      try {
        const [provinces, cities, barangays] = await Promise.all([
          fetchAddressJson<ProvinceAddress[]>("/ph-address/province.json"),
          fetchAddressJson<CityAddress[]>("/ph-address/city.json"),
          fetchAddressJson<BarangayAddress[]>("/ph-address/barangay.json"),
        ]);

        if (isCancelled) return;

        const provincesByCode = new Map(
          provinces.map((province) => [
            province.province_code,
            province.province_name,
          ]),
        );
        const citiesByCode = new Map(
          cities.map((city) => [city.city_code, city]),
        );

        const nextSuggestions = barangays.flatMap((barangay) => {
          const city = citiesByCode.get(barangay.city_code);
          const provinceName = provincesByCode.get(barangay.province_code);

          if (!city || !provinceName) {
            return [];
          }

          const label = `${city.city_name}, ${provinceName}, ${barangay.brgy_name}`;

          return [
            {
              id: barangay.brgy_code,
              label,
              searchText: label.toLowerCase(),
            },
          ];
        });

        setAddressSuggestions(nextSuggestions);
        setAddressLoadStatus("ready");
      } catch {
        if (!isCancelled) {
          setAddressLoadStatus("error");
        }
      }
    }

    void loadAddresses();

    return () => {
      isCancelled = true;
    };
  }, [addressLoadStatus, step]);

  const locationMatches = useMemo(() => {
    const query = data.location.trim().toLowerCase();

    if (query.length < 2 || addressLoadStatus !== "ready") {
      return [];
    }

    return addressSuggestions
      .filter((suggestion) => suggestion.searchText.includes(query))
      .slice(0, LOCATION_SUGGESTION_LIMIT);
  }, [addressLoadStatus, addressSuggestions, data.location]);

  /* ---- field helpers ---- */

  const update = useCallback(
    <K extends keyof InquiryFormData>(name: K, value: string) => {
      setData((prev) => ({ ...prev, [name]: value }));
      if (touched.has(name)) {
        setErrors((prev) => {
          const err = validateField(name, value);
          if (!err) {
            const next = { ...prev };
            delete next[name];
            if (name === "phone" || name === "email") {
              delete next.phone;
              delete next.email;
            }
            return next;
          }
          return { ...prev, [name]: err };
        });
      }
    },
    [touched],
  );

  const blur = useCallback((name: keyof InquiryFormData) => {
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

  const stepFields: Record<number, (keyof InquiryFormData)[]> = {
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
    if (s === 1 && !data.phone.trim() && !data.email.trim()) {
      newErrors.phone = "Enter either a phone number or email address";
      valid = false;
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

  function updatePhoto(file: File | null) {
    const error = validatePhoto(file);
    setPhoto(file);
    setPhotoError(error);
  }

  function clearPhoto() {
    updatePhoto(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  }

  /* ---- submit ---- */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep(step)) return;

    const nextPhotoError = validatePhoto(photo);
    if (nextPhotoError) {
      setPhotoError(nextPhotoError);
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const payload = new window.FormData();
    payload.append("name", data.name.trim());
    payload.append("phone", data.phone.trim());
    payload.append("email", data.email.trim());
    payload.append("service", data.service);
    payload.append("location", data.location.trim());
    payload.append("propertyType", data.propertyType);
    payload.append("message", buildMessage(data));
    if (photo) {
      payload.append("photo", photo);
    }

    try {
      const response = await fetch("/api/quotation", {
        method: "POST",
        body: payload,
      });

      const result = (await response.json()) as {
        error?: string;
        photoAttached?: boolean;
        warning?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Unable to send inquiry.");
      }

      formRef.current?.reset();
      setData(INITIAL);
      setStep(1);
      setTouched(new Set());
      setErrors({});
      setPhoto(null);
      setPhotoError("");
      if (result.warning) {
        setStatus({
          type: "warning",
          message: result.warning,
        });
      } else {
        setStatus({
          type: "success",
          message: result.photoAttached
            ? "Inquiry sent with photo! OSCOMP will review the details and get back to you."
            : "Inquiry sent! OSCOMP will review the details and get back to you.",
        });
      }
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

  function fieldClass(name: keyof InquiryFormData) {
    return `qf-field${errors[name] ? " qf-field-error" : ""}`;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Enter" && step < TOTAL_STEPS) {
      event.preventDefault();
      nextStep();
    }
  }

  function selectLocationSuggestion(location: string) {
    update("location", location);
    setShowLocationSuggestions(false);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.location;
      return next;
    });
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
              <span>Phone number</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
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
            <span>Email address</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
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
                  <span className="material-icons qf-service-icon" aria-hidden="true">
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

          <div
            className={`${fieldClass("location")} qf-location-field`}
            style={{ marginTop: "1.25rem" }}
          >
            <label htmlFor="service-location">Service location *</label>
            <div className="qf-location-combobox">
              <input
                id="service-location"
                name="location"
                type="text"
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={
                  showLocationSuggestions && locationMatches.length > 0
                }
                aria-controls="service-location-suggestions"
                required
                maxLength={140}
                placeholder="City/Municipality, Province, Barangay"
                value={data.location}
                onChange={(e) => {
                  update("location", e.target.value);
                  setShowLocationSuggestions(true);
                }}
                onBlur={() => {
                  blur("location");
                  setShowLocationSuggestions(false);
                }}
                onFocus={() => setShowLocationSuggestions(true)}
              />
              {showLocationSuggestions && locationMatches.length > 0 ? (
                <div
                  className="qf-location-suggestions"
                  id="service-location-suggestions"
                  role="listbox"
                >
                  {locationMatches.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion.id}
                      className="qf-location-suggestion"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectLocationSuggestion(suggestion.label)}
                      role="option"
                      aria-selected={data.location === suggestion.label}
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            {addressLoadStatus === "error" ? (
              <span className="qf-field-note">
                Address suggestions are unavailable, but you can still type the
                service location.
              </span>
            ) : null}
            {errors.location && (
              <span className="qf-error-msg">{errors.location}</span>
            )}
          </div>

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
        <div className="qf-step qf-step-compact">
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
              rows={3}
              maxLength={1000}
              placeholder="Describe the site, security concerns, camera preferences, or anything else that helps us prepare."
              value={data.message}
              onChange={(e) => update("message", e.target.value)}
            />
            <span className="qf-char-count">{data.message.length}/1000</span>
          </label>

          <div className={`qf-field qf-photo-field${photoError ? " qf-field-error" : ""}`}>
            <span>Upload photo for your service location (optional)</span>
            <label
              className={`qf-photo-dropzone${isPhotoDragging ? " active" : ""}`}
              htmlFor="inquiry-photo"
              onDragOver={(event) => {
                event.preventDefault();
                setIsPhotoDragging(true);
              }}
              onDragLeave={() => setIsPhotoDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsPhotoDragging(false);
                const file = event.dataTransfer.files.item(0);
                updatePhoto(file);
                if (photoInputRef.current) {
                  photoInputRef.current.value = "";
                }
              }}
            >
              <span className="material-icons" aria-hidden="true">
                add_photo_alternate
              </span>
              <span>
                <strong>Upload or drag image</strong>
                <small>JPEG, PNG, WebP, HEIC, HEIF up to 2 MB</small>
              </span>
              <input
                id="inquiry-photo"
                name="photo"
                type="file"
                accept="image/*"
                ref={photoInputRef}
                onChange={(event) => {
                  updatePhoto(event.target.files?.[0] ?? null);
                }}
              />
            </label>
            {photo ? (
              <div className="qf-photo-selection">
                <span>
                  {photo.name} ({formatFileSize(photo.size)})
                </span>
                <button
                  type="button"
                  className="qf-photo-clear"
                  onClick={clearPhoto}
                >
                  Remove
                </button>
              </div>
            ) : null}
            {photoError ? (
              <span className="qf-error-msg">{photoError}</span>
            ) : null}
          </div>

          <div className="qf-step-actions qf-step-actions-compact">
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
