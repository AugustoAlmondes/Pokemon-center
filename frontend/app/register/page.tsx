"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { api, ApiRequestError } from "@/lib/api";
import { MdPerson, MdEmail, MdLock, MdCheckCircleOutline, MdErrorOutline, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useRouter } from "next/navigation";
import LogoPokebola from "@/components/LogoPokebola";

/* ── Schema Zod ─────────────────────────────── */
const registerSchema = z.object({
  name: z.string().min(4, "O nome deve ter pelo menos 4 caracteres."),
  email: z.string().min(1, "O e-mail é obrigatório."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

type RegisterFields = z.infer<typeof registerSchema>;
type FieldErrors = Partial<Record<keyof RegisterFields, string>>;

export default function RegisterPage() {
  const router = useRouter();
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
        router.push("/login");
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
            <LogoPokebola />
          </div>
          <h1 className="card-title">Novo Treinador</h1>
          <p className="card-subtitle">Cadastre-se na Pokédex</p>
        </div>

        {serverError && (
          <div className="error-alert" role="alert">
            <MdErrorOutline size={18} />
            {serverError}
          </div>
        )}

        {isSuccess ? (
          <div className="success-alert" role="alert" style={{ textAlign: "center", padding: "2rem 0" }}>
            <MdCheckCircleOutline size={48} style={{ margin: "0 auto 1rem", color: "#22c55e" }} />
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
                  <MdPerson size={18} />
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
                  <MdEmail size={18} />
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
                  <MdLock size={18} />
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
                    <MdVisibilityOff size={18} />
                  ) : (
                    <MdVisibility size={18} />
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
