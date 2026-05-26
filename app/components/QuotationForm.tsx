"use client";

import { FormEvent, useState } from "react";

const serviceOptions = [
  "CCTV Sales and Installation",
  "CCTV Maintenance and Troubleshooting",
  "Security Camera Setup",
  "Computer Repairs",
  "IT Solutions",
  "Networking and Cybersecurity",
  "Other Technology Support"
];

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function QuotationForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      service: String(formData.get("service") || ""),
      location: String(formData.get("location") || ""),
      message: String(formData.get("message") || "")
    };

    try {
      const response = await fetch("/api/quotation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to send inquiry.");
      }

      form.reset();
      setStatus({
        type: "success",
        message: "Inquiry sent. OSCOMP will review the details."
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send inquiry."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="quotation-form" onSubmit={handleSubmit}>
      <div className="quotation-form-grid">
        <label>
          <span>Name</span>
          <input name="name" type="text" required maxLength={80} />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" required minLength={6} maxLength={30} />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" required maxLength={100} />
        </label>
        <label>
          <span>Service</span>
          <select name="service" required defaultValue="">
            <option value="" disabled>
              Select service
            </option>
            {serviceOptions.map((service) => (
              <option value={service} key={service}>
                {service}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <span>Location</span>
        <input
          name="location"
          type="text"
          required
          maxLength={140}
          placeholder="Home, office, or project location"
        />
      </label>
      <label>
        <span>Project details</span>
        <textarea
          name="message"
          required
          rows={7}
          maxLength={1000}
          placeholder="Tell us about the site, cameras needed, preferred schedule, and any security concerns."
        />
      </label>
      <button className="btn btn-primary shadow" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send inquiry"}
      </button>
      {status.type !== "idle" ? (
        <p className={`quotation-status quotation-status-${status.type}`} role="status">
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
