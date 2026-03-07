"use client";

import { useState } from "react";
import { z } from "zod";

const pokemonSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  type: z.string().min(2, "O tipo deve ter pelo menos 2 caracteres."),
  level: z.coerce.number().min(1, "O nível deve ser no mínimo 1.").max(100, "O nível máximo é 100."),
  hp: z.coerce.number().min(1, "O HP deve ser no mínimo 1."),
  pokedexNumber: z.coerce.number().min(1, "O número da Pokédex deve ser no mínimo 1."),
});

type PokemonFormData = z.infer<typeof pokemonSchema>;
type FieldErrors = Partial<Record<keyof PokemonFormData, string>>;

interface Props {
  initialData?: Partial<PokemonFormData>;
  onSubmit: (data: PokemonFormData) => Promise<void>;
  submitLabel: string;
  isLoading: boolean;
  serverError?: string;
  successMessage?: string;
}

export function PokemonForm({ initialData, onSubmit, submitLabel, isLoading, serverError, successMessage }: Props) {
  const [fields, setFields] = useState<PokemonFormData>({
    name: initialData?.name || "",
    type: initialData?.type || "",
    level: initialData?.level || 1,
    hp: initialData?.hp || 10,
    pokedexNumber: initialData?.pokedexNumber || 1,
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof PokemonFormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = pokemonSchema.safeParse(fields);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof PokemonFormData;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    await onSubmit(result.data);
  }

  return (
    <div className="login-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
      {serverError && (
        <div className="error-alert" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {serverError}
        </div>
      )}

      {successMessage && (
         <div className="success-alert" role="alert" style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", color: "#4ade80", padding: "1rem", borderRadius: "8px", marginBottom: "1.25rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          
          {/* Nome */}
          <div className="field-group" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="name" className="field-label">Nome do Pokémon</label>
            <div className="input-wrapper">
              <input
                id="name"
                name="name"
                type="text"
                className={`field-input${fieldErrors.name ? " field-input--error" : ""}`}
                style={{ paddingLeft: "1rem" }}
                placeholder="Ex: Pikachu"
                value={fields.name}
                onChange={handleChange}
                autoFocus
              />
            </div>
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
          </div>

          {/* Tipo */}
          <div className="field-group" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="type" className="field-label">Tipo</label>
            <div className="input-wrapper">
              <input
                id="type"
                name="type"
                type="text"
                className={`field-input${fieldErrors.type ? " field-input--error" : ""}`}
                style={{ paddingLeft: "1rem" }}
                placeholder="Ex: Elétrico"
                value={fields.type}
                onChange={handleChange}
              />
            </div>
            {fieldErrors.type && <span className="field-error">{fieldErrors.type}</span>}
          </div>

          {/* Level */}
          <div className="field-group">
            <label htmlFor="level" className="field-label">Nível</label>
            <div className="input-wrapper">
              <input
                id="level"
                name="level"
                type="number"
                min="1"
                max="100"
                className={`field-input${fieldErrors.level ? " field-input--error" : ""}`}
                style={{ paddingLeft: "1rem" }}
                value={fields.level}
                onChange={handleChange}
              />
            </div>
            {fieldErrors.level && <span className="field-error">{fieldErrors.level}</span>}
          </div>

          {/* HP */}
          <div className="field-group">
            <label htmlFor="hp" className="field-label">HP Máximo</label>
            <div className="input-wrapper">
              <input
                id="hp"
                name="hp"
                type="number"
                min="1"
                className={`field-input${fieldErrors.hp ? " field-input--error" : ""}`}
                style={{ paddingLeft: "1rem" }}
                value={fields.hp}
                onChange={handleChange}
              />
            </div>
            {fieldErrors.hp && <span className="field-error">{fieldErrors.hp}</span>}
          </div>

          {/* Pokédex Number */}
          <div className="field-group" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="pokedexNumber" className="field-label">Número da Pokédex</label>
            <div className="input-wrapper">
              <input
                id="pokedexNumber"
                name="pokedexNumber"
                type="number"
                min="1"
                className={`field-input${fieldErrors.pokedexNumber ? " field-input--error" : ""}`}
                style={{ paddingLeft: "1rem" }}
                value={fields.pokedexNumber}
                onChange={handleChange}
              />
            </div>
            {fieldErrors.pokedexNumber && <span className="field-error">{fieldErrors.pokedexNumber}</span>}
          </div>

        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}
          style={{ marginTop: "1rem" }}
        >
          {isLoading ? (
            <>
              <span className="spinner" />
              Salvando...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </form>
    </div>
  );
}
