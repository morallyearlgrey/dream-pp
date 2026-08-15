import { NextResponse } from "next/server";

const limits = {
  authorName: 120,
  note: 2000,
  replyToEmail: 254,
};
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMaxRequests = 5;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

type ContactPayload = {
  authorName: string;
  note: string;
  replyToEmail: string;
};

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (hasHoneypotValue(payload)) {
    return NextResponse.json({ message: "Note received." });
  }

  const parsed = parseContactPayload(payload);

  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (isRateLimited(getRateLimitKey(request))) {
    return NextResponse.json(
      { error: "Too many notes sent. Please wait and try again." },
      { status: 429 },
    );
  }

  const emailConfig = getEmailConfig();

  if ("error" in emailConfig) {
    return NextResponse.json({ error: emailConfig.error }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      body: JSON.stringify({
        from: emailConfig.from,
        html: renderContactHtml(parsed),
        reply_to: parsed.replyToEmail,
        subject: `Portfolio note from ${parsed.authorName}`,
        text: renderContactText(parsed),
        to: [emailConfig.to],
      }),
      headers: {
        Authorization: `Bearer ${emailConfig.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Note could not be sent. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message: "Note sent. I will follow up from your reply-to email.",
    });
  } catch {
    return NextResponse.json(
      { error: "Note could not be sent. Please try again later." },
      { status: 502 },
    );
  }
}

function parseContactPayload(payload: unknown): ContactPayload | { error: string } {
  if (!payload || typeof payload !== "object") {
    return { error: "Request body is required." };
  }

  const body = payload as Record<string, unknown>;
  const authorName = normalizeSingleLine(body.authorName);
  const replyToEmail = normalizeSingleLine(body.replyToEmail).toLowerCase();
  const note = normalizeNote(body.note);

  if (authorName.length < 2 || authorName.length > limits.authorName) {
    return { error: "Name must be between 2 and 120 characters." };
  }

  if (
    replyToEmail.length < 3 ||
    replyToEmail.length > limits.replyToEmail ||
    !emailPattern.test(replyToEmail)
  ) {
    return { error: "Enter a valid reply-to email." };
  }

  if (note.length < 12 || note.length > limits.note) {
    return { error: "Note must be between 12 and 2000 characters." };
  }

  return { authorName, note, replyToEmail };
}

function hasHoneypotValue(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const body = payload as Record<string, unknown>;
  return typeof body.website === "string" && body.website.trim().length > 0;
}

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_EMAIL_FROM?.trim();
  const to = process.env.CONTACT_EMAIL_TO?.trim();

  if (!apiKey || !from || !to) {
    return {
      error:
        "Contact email is not configured. Set CONTACT_EMAIL_TO, CONTACT_EMAIL_FROM, and RESEND_API_KEY.",
    };
  }

  if (!emailPattern.test(to)) {
    return { error: "CONTACT_EMAIL_TO must be a valid email address." };
  }

  return { apiKey, from, to };
}

function getRateLimitKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const userAgent = request.headers.get("user-agent")?.slice(0, 80) ?? "unknown";

  return `${forwardedFor || realIp || "local"}:${userAgent}`;
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimits.get(key);

  for (const [storedKey, entry] of rateLimits.entries()) {
    if (entry.resetAt <= now) {
      rateLimits.delete(storedKey);
    }
  }

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  current.count += 1;
  rateLimits.set(key, current);

  return current.count > rateLimitMaxRequests;
}

function normalizeSingleLine(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function normalizeNote(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}

function renderContactText(payload: ContactPayload) {
  return [
    "New portfolio note",
    "",
    `Name: ${payload.authorName}`,
    `Reply-To: ${payload.replyToEmail}`,
    "",
    payload.note,
  ].join("\n");
}

function renderContactHtml(payload: ContactPayload) {
  return `
    <div style="font-family: Arial, sans-serif; color: #171311; line-height: 1.5;">
      <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0; color: #8f2b35; font-weight: 700;">New portfolio note</p>
      <h1 style="font-family: Georgia, serif; text-transform: uppercase; margin: 0 0 16px; color: #171311;">${escapeHtml(payload.authorName)}</h1>
      <p><strong>Reply-To:</strong> ${escapeHtml(payload.replyToEmail)}</p>
      <hr style="border: 0; border-top: 1px solid #d8c9aa; margin: 18px 0;" />
      <p>${escapeHtml(payload.note).replace(/\n/g, "<br />")}</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
