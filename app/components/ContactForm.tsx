"use client";

import { useSearchParams } from "next/navigation";

const serviceGroups = [
  {
    label: "CCTV Promo",
    options: [
      { value: "entry", label: "Entry-Level Security" },
      { value: "ideal", label: "Ideal Home Security" },
      { value: "full", label: "Full Package Security" },
      { value: "custom", label: "Custom Package Security" }
    ]
  },
  {
    label: "Electronic Repair",
    options: [
      { value: "computer-repair", label: "Computer Repair" },
      { value: "electronic-repair", label: "Electronic Repair" }
    ]
  },
  {
    label: "IT Solution",
    options: [
      { value: "networking-cybersecurity", label: "Networking & Cybersecurity" }
    ]
  }
];

const validServices = new Set(
  serviceGroups.flatMap((group) => group.options.map((option) => option.value))
);

export function ContactForm() {
  const searchParams = useSearchParams();
  const serviceFromQuery = searchParams.get("service") || "";
  const selectedService = validServices.has(serviceFromQuery)
    ? serviceFromQuery
    : "";

  return (
    <form
      className="p-3 p-xl-4"
      method="post"
      action="https://formspree.io/f/mvoyoder"
    >
      <div className="mb-3">
        <input
          className="form-control"
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          required
          maxLength={50}
        />
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
          maxLength={50}
        />
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          type="tel"
          id="phone"
          name="phone"
          placeholder="Phone Number"
          minLength={6}
          required
          maxLength={15}
        />
      </div>
      <div className="mb-3">
        <select
          className="form-select"
          id="service"
          name="service"
          required
          defaultValue={selectedService}
          key={selectedService}
        >
          <option value="" disabled>
            --Select Service--
          </option>
          {serviceGroups.map((group) => (
            <optgroup label={group.label} key={group.label}>
              {group.options.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          id="message"
          name="message"
          rows={6}
          placeholder="Message"
          maxLength={300}
        />
      </div>
      <div>
        <button className="btn btn-primary shadow d-block w-100" type="submit">
          Send
        </button>
      </div>
    </form>
  );
}
