import { NextResponse } from "next/server";

type PricingInquiryRequest = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  location?: unknown;
  packageName?: unknown;
};

const fieldLimits = {
  name: 80,
  phone: 30,
  email: 100,
  location: 140,
  packageName: 80,
};

function cleanField(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: PricingInquiryRequest;

  try {
    body = (await request.json()) as PricingInquiryRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid pricing inquiry payload." },
      { status: 400 },
    );
  }

  const inquiry = {
    name: cleanField(body.name, fieldLimits.name),
    phone: cleanField(body.phone, fieldLimits.phone),
    email: cleanField(body.email, fieldLimits.email),
    location: cleanField(body.location, fieldLimits.location),
    packageName: cleanField(body.packageName, fieldLimits.packageName),
  };

  if (!inquiry.name || !inquiry.location || !inquiry.packageName) {
    return NextResponse.json(
      { error: "Name, location, and package name are required." },
      { status: 400 },
    );
  }

  if (!inquiry.phone && !inquiry.email) {
    return NextResponse.json(
      { error: "Please provide either a phone number or email address." },
      { status: 400 },
    );
  }

  if (inquiry.email && !isValidEmail(inquiry.email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const topic = process.env.NTFY_TOPIC?.trim();
  if (!topic) {
    return NextResponse.json(
      { error: "Inquiry notification is not configured." },
      { status: 500 },
    );
  }

  const baseUrl = (process.env.NTFY_BASE_URL || "https://ntfy.sh").replace(/\/$/, "");
  const topicPath = topic.replace(/^\/+/, "");
  const token = process.env.NTFY_TOKEN?.trim();
  const message = [
    "New OSCOMP pricing inquiry",
    "",
    `Inquiry type: Pricing package inquiry`,
    `Package: ${inquiry.packageName}`,
    `Name: ${inquiry.name}`,
    `Phone: ${inquiry.phone || "Not provided"}`,
    `Email: ${inquiry.email || "Not provided"}`,
    `Location: ${inquiry.location}`,
  ].join("\n");

  try {
    const response = await fetch(`${baseUrl}/${encodeURIComponent(topicPath)}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Priority: "4",
        Tags: "moneybag,camera",
        Title: `OSCOMP pricing inquiry - ${inquiry.packageName}`,
      },
      body: message,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to send pricing inquiry notification." },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Unable to reach inquiry notification service." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
