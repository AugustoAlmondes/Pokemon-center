"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { api, ApiRequestError } from "@/lib/api";
import LogoPokebola from "@/components/LogoPokebola";

/* ── Schema Zod ─────────────────────────────── */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório."),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres."),
});

type LoginFields = z.infer<typeof loginSchema>;
type FieldErrors = Partial<Record<keyof LoginFields, string>>;

/* ── Tipo da resposta da API ────────────────── */
interface LoginResponse {
  access_token?: string;
  token?: string;
}

/* ── Componente ─────────────────────────────── */
export default function LoginPage() {
  const [fields, setFields] = useState<LoginFields>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Limpa o erro do campo ao digitar
    if (fieldErrors[name as keyof LoginFields]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    // Validação local com Zod
    const result = loginSchema.safeParse(fields);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFields;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const data = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: result.data,
      });

      localStorage.setItem("token", data.access_token ?? data.token ?? "");
      window.location.href = "/dashboard";
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setServerError(err.message);
      } else {
        setServerError("Erro inesperado. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-root">
      {/* Ambient background orbs */}
      <div className="orb orb-red" aria-hidden="true" />
      <div className="orb orb-yellow" aria-hidden="true" />
      <div className="orb orb-blue" aria-hidden="true" />

      {/* Poké Ball decorativa */}
      <div className="pokeball-deco" aria-hidden="true">
        <div className="pb-top" />
        <div className="pb-divider" />
        <div className="pb-button" />
        <div className="pb-bottom" />
      </div>

      {/* Grid overlay */}
      <div className="grid-overlay" aria-hidden="true" />

      <section className="login-card" role="main">
        {/* Header */}
        <div className="card-header">
          <div className="logo-icon" aria-hidden="true">
            <LogoPokebola />
          </div>
          <h1 className="card-title">Pokémon Center</h1>
          <p className="card-subtitle">Acesse sua conta de treinador</p>
        </div>

        {/* Erro do servidor */}
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

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Campo e-mail */}
          <div className="field-group">
            <label htmlFor="email" className="field-label">
              E-mail
            </label>
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
                autoFocus
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

          {/* Campo senha */}
          <div className="field-group">
            <label htmlFor="password" className="field-label">
              Senha
            </label>
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
                autoComplete="current-password"
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
                Entrando…
              </>
            ) : (
              "Entrar na Pokédex"
            )}
          </button>
        </form>

        {/* Rodapé */}
        <p className="card-footer">
          Não tem uma conta?{" "}
          <Link href="/register" className="footer-link">
            Registre-se
          </Link>
        </p>
      </section>
    </main>
  );
}
