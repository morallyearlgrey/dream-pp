"use client";

import { type FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = {
  authorName: string;
  contactSignal: string;
  note: string;
  replyToEmail: string;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const initialForm: FormState = {
  authorName: "",
  contactSignal: "",
  note: "",
  replyToEmail: "",
};

export function ContactNoteForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");

  function validateClient() {
    if (form.authorName.trim().length < 2) {
      return "Name is required.";
    }

    if (!emailPattern.test(form.replyToEmail.trim())) {
      return "Enter a valid reply-to email.";
    }

    if (form.note.trim().length < 12) {
      return "Note must be at least 12 characters.";
    }

    return "";
  }

  async function submitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateClient();

    if (validationError) {
      setStatus("error");
      setMessage(validationError);
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Note could not be sent.");
      }

      setForm(initialForm);
      setStatus("success");
      setMessage(payload.message ?? "Note sent. I will follow up from your reply-to email.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Note could not be sent.");
    }
  }

  return (
    <section className="relative min-w-0 border-y border-[var(--color-text)]/16 bg-[var(--color-card-surface)]/92 p-3 text-[var(--color-text)] backdrop-blur-sm sm:p-4">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--color-text)]/14 pb-3 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/54">
        <span className="text-[#8f2b35]">Send A Note</span>
        <span>Reply-To Enabled</span>
      </div>

      <form className="mt-4 grid gap-4" onSubmit={submitNote}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        >
          <label htmlFor="contact-signal">Leave this field blank</label>
          <input
            autoComplete="new-password"
            id="contact-signal"
            name="contactSignal"
            onChange={(event) =>
              setForm((current) => ({ ...current, contactSignal: event.target.value }))
            }
            tabIndex={-1}
            value={form.contactSignal}
          />
        </div>

        <div className="grid gap-px border-y border-[var(--color-text)]/12 bg-transparent">
          <label className="grid gap-2 bg-[var(--color-card-surface)] p-3" htmlFor="contact-name">
            <span className="text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
              Name
            </span>
            <input
              autoComplete="name"
              className="min-h-10 bg-transparent text-sm font-light leading-6 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/28 focus:text-[var(--color-paper)]"
              id="contact-name"
              maxLength={120}
              onChange={(event) =>
                setForm((current) => ({ ...current, authorName: event.target.value }))
              }
              placeholder="Who should I reply to?"
              required
              value={form.authorName}
            />
          </label>

          <label className="grid gap-2 bg-[var(--color-card-surface)] p-3" htmlFor="contact-email">
            <span className="text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
              Response Email / Reply-To
            </span>
            <input
              autoComplete="email"
              className="min-h-10 bg-transparent text-sm font-light leading-6 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/28 focus:text-[var(--color-paper)]"
              id="contact-email"
              inputMode="email"
              maxLength={254}
              onChange={(event) =>
                setForm((current) => ({ ...current, replyToEmail: event.target.value }))
              }
              placeholder="name@example.com"
              required
              type="email"
              value={form.replyToEmail}
            />
          </label>

          <label className="grid gap-2 bg-[var(--color-card-surface)] p-3" htmlFor="contact-note">
            <span className="text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
              Note / Message
            </span>
            <textarea
              className="min-h-36 resize-none bg-transparent text-sm font-light leading-6 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/28 focus:text-[var(--color-paper)]"
              id="contact-note"
              maxLength={2000}
              onChange={(event) =>
                setForm((current) => ({ ...current, note: event.target.value }))
              }
              placeholder="Leave a note, question, collaboration idea, or anything worth following up on."
              required
              value={form.note}
            />
          </label>
        </div>

        <div className="flex flex-col items-center gap-3 border-y border-[var(--color-text)]/14 py-3">
          {message ? (
            <p
              aria-live="polite"
              className={`flex min-h-5 min-w-0 items-center gap-2 text-center text-[9px] font-bold uppercase leading-4 ${
                status === "success" ? "text-[#8f2b35]" : "text-[var(--color-text)]"
              }`}
            >
              {status === "success" ? <CheckCircle2 aria-hidden="true" size={14} /> : null}
              {status === "error" ? <AlertCircle aria-hidden="true" size={14} /> : null}
              <span className="min-w-0">{message}</span>
            </p>
          ) : null}
          <button
            className="inline-flex min-h-9 items-center justify-center gap-2 border border-[var(--color-text)]/26 bg-[var(--color-text)] px-3 text-[9px] font-bold uppercase leading-none text-[var(--color-deep)] transition hover:border-[#8f2b35] hover:bg-[#8f2b35] hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={status === "submitting"}
            type="submit"
          >
            <Send aria-hidden="true" size={12} strokeWidth={1.9} />
            {status === "submitting" ? "Sending" : "Send Note"}
          </button>
        </div>
      </form>

    </section>
  );
}
