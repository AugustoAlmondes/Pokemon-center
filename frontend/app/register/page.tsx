"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { api, ApiRequestError } from "@/lib/api";

/* ── Schema Zod ─────────────────────────────── */
const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().min(1, "O e-mail é obrigatório.").email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

type RegisterFields = z.infer<typeof registerSchema>;
type FieldErrors = Partial<Record<keyof RegisterFields, string>>;

export default function RegisterPage() {
  const [fields, setFields] = useState<RegisterFields>({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name as keyof RegisterFields]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const result = registerSchema.safeParse(fields);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof RegisterFields;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await api("/auth/register", {
        method: "POST",
        body: result.data,
      });

      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setServerError(err.message);
      } else {
        setServerError("Erro inesperado. Tente novamente.");
      }
    } finally {
      if (!isSuccess) {
        setIsLoading(false);
      }
    }
  }

  return (
    <main className="login-root">
      <div className="orb orb-red" aria-hidden="true" />
      <div className="orb orb-yellow" aria-hidden="true" />
      <div className="orb orb-blue" aria-hidden="true" />

      <div className="pokeball-deco" aria-hidden="true">
        <div className="pb-top" />
        <div className="pb-divider" />
        <div className="pb-button" />
        <div className="pb-bottom" />
      </div>

      <div className="grid-overlay" aria-hidden="true" />

      <section className="login-card" role="main">
        <div className="card-header">
          <div className="logo-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="2" />
              <path d="M1 16h10.5M20.5 16H31" stroke="white" strokeWidth="2" />
              <path
                d="M1 16C1 8.82 7.82 3 16 3s15 5.82 15 13"
                stroke="#EF4444"
                strokeWidth="2"
                fill="#EF4444"
                fillOpacity="0.15"
              />
              <circle cx="16" cy="16" r="4" fill="white" stroke="#1e1e2e" strokeWidth="2" />
              <circle cx="16" cy="16" r="2" fill="#EF4444" />
            </svg>
          </div>
          <h1 className="card-title">Novo Treinador</h1>
          <p className="card-subtitle">Cadastre-se na Pokédex</p>
        </div>

        {serverError && (
          <div className="error-alert" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {serverError}
          </div>
        )}

        {isSuccess ? (
          <div className="success-alert" role="alert" style={{ textAlign: "center", padding: "2rem 0" }}>
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" style={{ margin: "0 auto 1rem" }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h2 style={{ fontSize: "1.25rem", color: "#f0f0ff", marginBottom: "0.5rem" }}>Cadastro concluído!</h2>
            <p style={{ color: "var(--text-muted)" }}>Redirecionando para o login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Nome */}
            <div className="field-group">
              <label htmlFor="name" className="field-label">Nome</label>
              <div className="input-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`field-input${fieldErrors.name ? " field-input--error" : ""}`}
                  placeholder="Ash Ketchum"
                  value={fields.name}
                  onChange={handleChange}
                  autoComplete="name"
                  autoFocus
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  aria-invalid={!!fieldErrors.name}
                />
              </div>
              {fieldErrors.name && (
                <span id="name-error" className="field-error text-red-500 text-sm bg-red-100 rounded-md p-2" role="alert">
                  {fieldErrors.name}
                </span>
              )}
            </div>

            {/* E-mail */}
            <div className="field-group">
              <label htmlFor="email" className="field-label">E-mail</label>
              <div className="input-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`field-input${fieldErrors.email ? " field-input--error" : ""}`}
                  placeholder="ash@pokemon.com"
                  value={fields.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  aria-invalid={!!fieldErrors.email}
                />
              </div>
              {fieldErrors.email && (
                <span id="email-error" className="field-error text-red-500 text-sm bg-red-100 rounded-md p-2" role="alert">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Senha */}
            <div className="field-group">
              <label htmlFor="password" className="field-label">Senha</label>
              <div className="input-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`field-input${fieldErrors.password ? " field-input--error" : ""}`}
                  placeholder="••••••••"
                  value={fields.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  aria-invalid={!!fieldErrors.password}
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <span id="password-error" className="field-error text-red-500 text-sm bg-red-100 rounded-md p-2" role="alert">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Cadastrando…
                </>
              ) : (
                "Criar Conta"
              )}
            </button>
          </form>
        )}

        {!isSuccess && (
          <p className="card-footer">
            Já possui uma conta?{" "}
            <Link href="/login" className="footer-link">
              Faça login
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
