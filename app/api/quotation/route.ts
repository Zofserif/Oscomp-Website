import { NextResponse } from "next/server";

type QuotationRequest = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  service?: unknown;
  category?: unknown;
  location?: unknown;
  propertyType?: unknown;
  message?: unknown;
};

type ParsedQuotationRequest = {
  body: QuotationRequest;
  photo: File | null;
};

const fieldLimits = {
  name: 80,
  phone: 30,
  email: 100,
  service: 80,
  category: 80,
  location: 140,
  propertyType: 40,
  message: 1000
};

const photoMaxSize = 2 * 1024 * 1024;
const photoMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif"
]);
const photoExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif"
};

function cleanField(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File;
}

function getPhotoError(photo: File | null) {
  if (!photo) return "";

  if (!photoMimeTypes.has(photo.type)) {
    return "Please attach a JPEG, PNG, WebP, HEIC, or HEIF photo.";
  }

  if (photo.size > photoMaxSize) {
    return "Photo must be 2 MB or smaller.";
  }

  return "";
}

function getSafePhotoFilename(photo: File) {
  const extension = photoExtensions[photo.type] || "jpg";
  return `oscomp-inquiry-photo-${Date.now()}.${extension}`;
}

async function parseRequest(request: Request): Promise<ParsedQuotationRequest> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const photoField = formData.get("photo");

    return {
      body: {
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        service: formData.get("service"),
        category: formData.get("category"),
        location: formData.get("location"),
        propertyType: formData.get("propertyType"),
        message: formData.get("message")
      },
      photo: isFile(photoField) && photoField.size > 0 ? photoField : null
    };
  }

  if (contentType.includes("application/json")) {
    return {
      body: (await request.json()) as QuotationRequest,
      photo: null
    };
  }

  throw new Error("Unsupported inquiry payload.");
}

export async function POST(request: Request) {
  let parsed: ParsedQuotationRequest;

  try {
    parsed = await parseRequest(request);
  } catch {
    return NextResponse.json({ error: "Invalid inquiry payload." }, { status: 400 });
  }

  const quotation = {
    name: cleanField(parsed.body.name, fieldLimits.name),
    phone: cleanField(parsed.body.phone, fieldLimits.phone),
    email: cleanField(parsed.body.email, fieldLimits.email),
    service: cleanField(parsed.body.service, fieldLimits.service),
    category: cleanField(parsed.body.category, fieldLimits.category),
    location: cleanField(parsed.body.location, fieldLimits.location),
    propertyType: cleanField(parsed.body.propertyType, fieldLimits.propertyType),
    message: cleanField(parsed.body.message, fieldLimits.message)
  };

  const category = quotation.category || quotation.service;
  const requiredFields = {
    name: quotation.name,
    service: category,
    location: quotation.location,
    message: quotation.message
  };
  const missingField = Object.entries(requiredFields).find(([, value]) => !value);

  if (missingField) {
    return NextResponse.json(
      { error: `Missing required field: ${missingField[0]}.` },
      { status: 400 }
    );
  }

  if (!quotation.phone && !quotation.email) {
    return NextResponse.json(
      { error: "Please provide either a phone number or email address." },
      { status: 400 }
    );
  }

  if (quotation.email && !isValidEmail(quotation.email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const photoError = getPhotoError(parsed.photo);
  if (photoError) {
    return NextResponse.json({ error: photoError }, { status: 400 });
  }

  const topic = process.env.NTFY_TOPIC?.trim();

  if (!topic) {
    return NextResponse.json(
      { error: "Inquiry notification is not configured." },
      { status: 500 }
    );
  }

  const baseUrl = (process.env.NTFY_BASE_URL || "https://ntfy.sh").replace(/\/$/, "");
  const topicPath = topic.replace(/^\/+/, "");
  const token = process.env.NTFY_TOKEN?.trim();
  const message = [
    "New OSCOMP inquiry",
    "",
    `Name: ${quotation.name}`,
    `Phone: ${quotation.phone || "Not provided"}`,
    `Email: ${quotation.email || "Not provided"}`,
    `Category: ${category}`,
    `Service: ${quotation.service || category}`,
    `Location: ${quotation.location}`,
    `Property type: ${quotation.propertyType || "Not provided"}`,
    "",
    "Project details:",
    quotation.message
  ].join("\n");

  const ntfyUrl = `${baseUrl}/${encodeURIComponent(topicPath)}`;

  try {
    const response = await fetch(`${baseUrl}/${encodeURIComponent(topicPath)}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Priority: "4",
        Tags: "camera,shield",
        Title: `OSCOMP inquiry - ${category}`
      },
      body: message
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to send inquiry notification." },
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Unable to reach inquiry notification service." },
      { status: 502 }
    );
  }

  if (parsed.photo) {
    try {
      const photoResponse = await fetch(ntfyUrl, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": parsed.photo.type,
          Filename: getSafePhotoFilename(parsed.photo),
          Message: `Photo attachment for ${quotation.name}`,
          Priority: "4",
          Tags: "camera,framed_picture",
          Title: `OSCOMP inquiry photo - ${category}`
        },
        body: parsed.photo
      });

      if (!photoResponse.ok) {
        return NextResponse.json({
          ok: true,
          warning:
            "Inquiry sent, but the photo could not be attached. Please send a smaller photo separately if needed."
        });
      }
    } catch {
      return NextResponse.json({
        ok: true,
        warning:
          "Inquiry sent, but the photo could not be attached. Please send a smaller photo separately if needed."
      });
    }

    return NextResponse.json({ ok: true, photoAttached: true });
  }

  return NextResponse.json({ ok: true, photoAttached: false });
}
