"use client";

import { useState, type FormEvent } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";

const INTEREST_OPTIONS = [
  "Investor",
  "Collector",
  "Trader",
  "Merchant",
  "Just curious",
] as const;

type FormStatus = "idle" | "loading" | "success" | "duplicate" | "error";

const inputClassName =
  "w-full border border-[#c4a96a]/20 bg-[#1a1410] px-4 py-3 text-sm text-[#f5f1eb] placeholder:text-[#f5f1eb]/30 outline-none transition-colors focus:border-[#c4a96a]/50";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interest, setInterest] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase.from("waitlist_signups").insert({
        email: trimmedEmail,
        name: trimmedName || null,
        interest: interest || null,
      });

      if (error) {
        if (error.code === "23505") {
          setStatus("duplicate");
          return;
        }
        setStatus("error");
        setErrorMessage(error.message);
        return;
      }

      setStatus("success");
      setEmail("");
      setName("");
      setInterest("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <div>
        <label htmlFor="waitlist-email" className="sr-only">
          Email
        </label>
        <input
          id="waitlist-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="waitlist-name" className="sr-only">
          Name
        </label>
        <input
          id="waitlist-name"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === "loading"}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="waitlist-interest" className="sr-only">
          Interest
        </label>
        <select
          id="waitlist-interest"
          name="interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          disabled={status === "loading"}
          className={`${inputClassName} ${interest ? "text-[#f5f1eb]" : "text-[#f5f1eb]/30"}`}
        >
          <option value="">Interest (optional)</option>
          {INTEREST_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-12 w-full items-center justify-center bg-[#c4a96a] px-8 text-xs uppercase tracking-[0.2em] text-[#1a1410] transition-colors hover:bg-[#d4bc82] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : "Join Waitlist"}
      </button>

      {status === "success" && (
        <p className="text-center text-sm text-[#2d5a3d]" role="status">
          You&apos;re on the Vinoex early access list.
        </p>
      )}

      {status === "duplicate" && (
        <p className="text-center text-sm text-[#c4a96a]" role="status">
          You&apos;re already on the list.
        </p>
      )}

      {status === "error" && (
        <p className="text-center text-sm text-[#7a2020]" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
