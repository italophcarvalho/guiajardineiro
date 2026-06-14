"use client";

import { useState, useCallback } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Toast } from "@/components/ui/Toast";

export const dynamic = "force-static";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface FormState {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  assunto?: string;
  mensagem?: string;
}

const ASSUNTOS = [
  "Proposta de parceria",
  "Assessoria de imprensa",
  "Sugestão de pauta",
  "Dúvida sobre conteúdo",
  "Outros",
];

const EMPTY: FormState = { nome: "", email: "", assunto: "", mensagem: "" };

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

function validate(f: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!f.nome.trim()) errors.nome = "Nome é obrigatório.";
  if (!f.email.trim()) {
    errors.email = "E-mail é obrigatório.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    errors.email = "Informe um e-mail válido.";
  }
  if (!f.assunto) errors.assunto = "Selecione um assunto.";
  if (!f.mensagem.trim()) {
    errors.mensagem = "Mensagem é obrigatória.";
  } else if (f.mensagem.trim().length < 10) {
    errors.mensagem = "Mensagem muito curta (mínimo 10 caracteres).";
  }
  return errors;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ContatoPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showToast, setShowToast] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change.
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // Mock submission — reset form and show toast.
    setForm(EMPTY);
    setErrors({});
    setShowToast(true);
  }

  const dismissToast = useCallback(() => setShowToast(false), []);

  return (
    <>
      <div className="mx-auto max-w-container px-6 py-14">
        {/* Page title */}
        <div className="mb-10 max-w-[52ch]">
          <h1 className="font-lora text-[clamp(28px,4vw,40px)] font-bold tracking-[-0.02em] text-green-900">
            Fale com a gente
          </h1>
          <p className="mt-3 font-inter text-[17px] leading-relaxed text-body-2">
            Seja para propor uma parceria, sugerir uma pauta ou tirar uma dúvida
            sobre jardinagem — estamos aqui.
          </p>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* ---- Left: contact cards ---- */}
          <div className="flex flex-col gap-5">
            <ContactCard
              title="Parcerias editoriais"
              body="Produtos para teste, patrocínios ou colaborações editoriais."
              email="parcerias@guiajardineiro.com.br"
            />
            <ContactCard
              title="Assessoria de imprensa"
              body="Solicitações de entrevistas, dados para matérias ou uso de conteúdo."
              email="imprensa@guiajardineiro.com.br"
            />
          </div>

          {/* ---- Right: form ---- */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-card border border-border bg-surface p-7 shadow-card"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Nome"
                error={errors.nome}
                required
              >
                <input
                  type="text"
                  name="nome"
                  id="f-nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  autoComplete="name"
                  className={inputCls(!!errors.nome)}
                />
              </Field>

              <Field
                label="E-mail"
                error={errors.email}
                required
              >
                <input
                  type="email"
                  name="email"
                  id="f-email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  className={inputCls(!!errors.email)}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field
                label="Assunto"
                error={errors.assunto}
                required
              >
                <select
                  name="assunto"
                  id="f-assunto"
                  value={form.assunto}
                  onChange={handleChange}
                  className={inputCls(!!errors.assunto)}
                >
                  <option value="">Selecione um assunto…</option>
                  {ASSUNTOS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-5">
              <Field
                label="Mensagem"
                error={errors.mensagem}
                required
              >
                <textarea
                  name="mensagem"
                  id="f-mensagem"
                  rows={5}
                  value={form.mensagem}
                  onChange={handleChange}
                  placeholder="Escreva sua mensagem aqui…"
                  className={inputCls(!!errors.mensagem) + " resize-none"}
                />
              </Field>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-[11px] bg-terracotta py-3.5 font-inter text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-terracotta-hover"
            >
              Enviar mensagem
            </button>
          </form>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Mensagem enviada! Responderemos em até 2 dias úteis."
          onDone={dismissToast}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function ContactCard({
  title,
  body,
  email,
}: {
  title: string;
  body: string;
  email: string;
}) {
  return (
    <div className="flex gap-4 rounded-card border border-border bg-surface p-5">
      <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-green-tint text-green-700">
        <EnvelopeIcon />
      </span>
      <div>
        <div className="font-lora text-[17px] font-semibold text-green-900">
          {title}
        </div>
        <p className="mt-1 text-[14px] leading-snug text-muted">{body}</p>
        <a
          href={`mailto:${email}`}
          className="mt-2 block text-[14px] font-semibold text-green-700 hover:underline"
        >
          {email}
        </a>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-inter text-[13.5px] font-semibold text-ink">
        {label}
        {required && <span className="ml-0.5 text-terracotta">*</span>}
      </label>
      {children}
      {error && (
        <span role="alert" className="text-[12.5px] text-terracotta">
          {error}
        </span>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-[9px] border bg-surface-2 px-3.5 py-2.5 font-inter text-[15px] text-ink outline-none transition-all duration-150 placeholder:text-muted",
    hasError
      ? "border-terracotta/70 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
      : "border-border-2 focus:border-green-700/60 focus:ring-2 focus:ring-green-700/10",
  ].join(" ");
}

/* ---- Icons ------------------------------------------------------- */

function EnvelopeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
