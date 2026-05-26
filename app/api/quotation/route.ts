import { NextResponse } from "next/server";

type QuotationRequest = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  service?: unknown;
  location?: unknown;
  message?: unknown;
};

const fieldLimits = {
  name: 80,
  phone: 30,
  email: 100,
  service: 80,
  location: 140,
  message: 1000
};

function cleanField(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: QuotationRequest;

  try {
    body = (await request.json()) as QuotationRequest;
  } catch {
    return NextResponse.json({ error: "Invalid quotation payload." }, { status: 400 });
  }

  const quotation = {
    name: cleanField(body.name, fieldLimits.name),
    phone: cleanField(body.phone, fieldLimits.phone),
    email: cleanField(body.email, fieldLimits.email),
    service: cleanField(body.service, fieldLimits.service),
    location: cleanField(body.location, fieldLimits.location),
    message: cleanField(body.message, fieldLimits.message)
  };

  const missingField = Object.entries(quotation).find(([, value]) => !value);

  if (missingField) {
    return NextResponse.json(
      { error: `Missing required field: ${missingField[0]}.` },
      { status: 400 }
    );
  }

  if (!isValidEmail(quotation.email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const topic = process.env.NTFY_TOPIC?.trim();

  if (!topic) {
    return NextResponse.json(
      { error: "Quotation notification is not configured." },
      { status: 500 }
    );
  }

  const baseUrl = (process.env.NTFY_BASE_URL || "https://ntfy.sh").replace(/\/$/, "");
  const topicPath = topic.replace(/^\/+/, "");
  const token = process.env.NTFY_TOKEN?.trim();
  const message = [
    "New OSCOMP quotation request",
    "",
    `Name: ${quotation.name}`,
    `Phone: ${quotation.phone}`,
    `Email: ${quotation.email}`,
    `Service: ${quotation.service}`,
    `Location: ${quotation.location}`,
    "",
    "Project details:",
    quotation.message
  ].join("\n");

  try {
    const response = await fetch(`${baseUrl}/${encodeURIComponent(topicPath)}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Priority: "4",
        Tags: "moneybag,computer",
        Title: "OSCOMP quotation request"
      },
      body: message
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to send quotation notification." },
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Unable to reach quotation notification service." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
