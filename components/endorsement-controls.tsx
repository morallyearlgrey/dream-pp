"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function EndorsementControls({
  approved,
  disabled = false,
  featured,
  id,
}: {
  approved: boolean;
  disabled?: boolean;
  featured: boolean;
  id: string;
}) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function updateEndorsement(action: string, updates: { approved?: boolean; featured?: boolean }) {
    setPendingAction(action);
    setError("");

    try {
      const response = await fetch(`/api/endorsements/${id}`, {
        body: JSON.stringify(updates),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not update endorsement.");
      }

      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not update endorsement.");
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="mt-4 grid gap-2">
      <div className="flex flex-wrap gap-2">
        {!approved ? (
          <button
            className="border border-[#8f2b35]/45 px-3 py-2 text-[9px] font-bold uppercase leading-none text-[#8f2b35] transition hover:bg-[#8f2b35] hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={disabled || pendingAction !== null}
            onClick={() => updateEndorsement("approve", { approved: true })}
            type="button"
          >
            {pendingAction === "approve" ? "Approving" : "Approve"}
          </button>
        ) : null}
        <button
          className="border border-[var(--color-text)]/22 px-3 py-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/68 transition hover:border-[#8f2b35] hover:text-[#8f2b35] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={disabled || pendingAction !== null}
          onClick={() =>
            updateEndorsement(featured ? "unfeature" : "feature", { featured: !featured })
          }
          type="button"
        >
          {pendingAction === "feature"
            ? "Featuring"
            : pendingAction === "unfeature"
              ? "Removing"
              : featured
                ? "Remove from top 3"
                : "Feature in top 3"}
        </button>
        {approved ? (
          <button
            className="border border-[var(--color-text)]/14 px-3 py-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/46 transition hover:border-[#ffb0a8]/50 hover:text-[#ffb0a8] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={disabled || pendingAction !== null}
            onClick={() => updateEndorsement("hide", { approved: false })}
            type="button"
          >
            {pendingAction === "hide" ? "Hiding" : "Hide"}
          </button>
        ) : null}
      </div>
      {disabled ? (
        <p className="text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/36">
          Connect DATABASE_URL to moderate live endorsements.
        </p>
      ) : null}
      {error ? (
        <p className="text-[9px] font-bold uppercase leading-4 text-[#ffb0a8]">{error}</p>
      ) : null}
    </div>
  );
}
