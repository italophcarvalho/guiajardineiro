"use client";

import { useState, type FormEvent } from "react";

export interface NewsletterInlineProps {
  title?: string;
  subtitle?: string;
  /** Optional async handler; receives the submitted email. */
  onSubscribe?: (email: string) => void | Promise<void>;
}

/**
 * Inline (non-popup) newsletter block, embedded mid-article.
 * Shows an in-place success state on submit — no page reload.
 */
export function NewsletterInline({
  title = "Receba os melhores guias toda semana",
  subtitle = "Sem spam. Só conteúdo que vale a pena.",
  onSubscribe,
}: NewsletterInlineProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    try {
      await onSubscribe?.(email);
    } finally {
      setSubmitted(true);
    }
  }

  return (
    <section
      className="my-8 rounded-[16px] border border-border-2 p-6 sm:p-8"
      style={{ background: "linear-gradient(120deg, #FBF6EC, #F3F7F0)" }}
    >
      {submitted ? (
        <div className="flex items-center gap-3" role="status" aria-live="polite">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-pill bg-green-tint">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <div>
            <p className="font-lora text-lg font-semibold text-green-900">
              Inscrição confirmada!
            </p>
            <p className="text-sm text-muted">
              Confira seu e-mail para começar a receber os guias.
            </p>
          </div>
        </div>
      ) : (
        <>
          <h2 className="font-lora text-2xl font-bold tracking-tight text-green-900">
            {title}
          </h2>
          <p className="mt-1.5 max-w-prose font-inter text-[15px] text-muted">
            {subtitle}
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-5 flex flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Seu e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="flex-1 rounded-[11px] border border-border-3 bg-surface px-4 py-3.5 font-inter text-[15px] text-ink outline-none transition-colors focus:border-green-500"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-[11px] bg-terracotta px-6 py-3.5 font-inter text-[15px] font-semibold text-surface transition-all duration-200 hover:bg-terracotta-hover"
            >
              Quero receber
            </button>
          </form>
        </>
      )}
    </section>
  );
}

export default NewsletterInline;
