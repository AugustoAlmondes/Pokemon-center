"use client";

import { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdErrorOutline, MdCheckCircleOutline, MdWarning } from "react-icons/md";
import { translatePokemonType } from "@/lib/pokemon-utils";

const pokemonSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  type: z.string().min(2, "O tipo deve ter pelo menos 2 caracteres."),
  level: z.coerce.number().min(1, "O nível deve ser no mínimo 1.").max(100, "O nível máximo é 100."),
  hp: z.coerce.number().min(1, "O HP deve ser no mínimo 1."),
  pokedexNumber: z.coerce.number().min(1, "O número da Pokédex deve ser no mínimo 1."),
});

type PokemonFormData = z.infer<typeof pokemonSchema>;
type FieldErrors = Partial<Record<keyof PokemonFormData, string>>;

interface ConflictData {
  field: string;
  expected: string;
  actual: string;
}

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
  const [conflicts, setConflicts] = useState<ConflictData[]>([]);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof PokemonFormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function validateWithPokeAPI(data: PokemonFormData) {
    try {
      setIsValidating(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.name.toLowerCase().trim()}`);
      
      if (!response.ok) {
        // Pokemon not found in PokeAPI, proceed without conflicts
        return null;
      }

      const pokemonData = await response.json();
      const detectedConflicts: ConflictData[] = [];

      // Check Types
      const apiTypes = pokemonData.types.map((t: any) => t.type.name).join(", ");
      
      // Translate the user input before comparison
      const translatedUserType = data.type.split(",").map(t => translatePokemonType(t.trim())).join(", ");

      if (!translatedUserType.toLowerCase().split(",").some(t => apiTypes.toLowerCase().includes(t.trim()))) {
          detectedConflicts.push({
            field: "Tipo",
            expected: apiTypes,
            actual: data.type
          });
      }

      // Check Pokedex Number
      if (pokemonData.id !== data.pokedexNumber) {
        detectedConflicts.push({
          field: "Número da Pokédex",
          expected: String(pokemonData.id),
          actual: String(data.pokedexNumber)
        });
      }

      return detectedConflicts.length > 0 ? detectedConflicts : null;
    } catch (error) {
      console.error("Error validating with PokeAPI:", error);
      return null;
    } finally {
      setIsValidating(false);
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

    const detectedConflicts = await validateWithPokeAPI(result.data);
    
    // Prepare data for submission (translating types)
    const finalData = {
      ...result.data,
      type: result.data.type.split(",").map(t => translatePokemonType(t.trim())).join(", ")
    };

    if (detectedConflicts) {
      setConflicts(detectedConflicts);
      setShowConflictModal(true);
    } else {
      await onSubmit(finalData);
    }
  }

  const handleProceed = async () => {
    setShowConflictModal(false);
    const finalData = {
      ...fields,
      type: fields.type.split(",").map(t => translatePokemonType(t.trim())).join(", ")
    };
    await onSubmit(finalData);
  };


  return (
    <div className="login-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
      {serverError && (
        <div className="error-alert" role="alert">
          <MdErrorOutline size={18} />
          {serverError}
        </div>
      )}

      {successMessage && (
         <div className="success-alert" role="alert" style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", color: "#4ade80", padding: "1rem", borderRadius: "8px", marginBottom: "1.25rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <MdCheckCircleOutline size={18} />
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
          disabled={isLoading || isValidating}
          style={{ marginTop: "1rem" }}
        >
          {isLoading || isValidating ? (
            <>
              <span className="spinner" />
              {isValidating ? "Validando..." : "Salvando..."}
            </>
          ) : (
            submitLabel
          )}
        </button>
      </form>

      <Dialog open={showConflictModal} onOpenChange={setShowConflictModal}>
        <DialogContent className="bg-surface border-border text-primary backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-yellow">
              <MdWarning size={24} />
              Conflito Detectado
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              Os dados informados não coincidem com as informações da PokéAPI. Deseja prosseguir mesmo assim?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {conflicts.map((conflict, idx) => (
              <div key={idx} className="p-3 bg-black/20 rounded-lg border border-white/5">
                <p className="text-sm font-semibold text-accent mb-1">{conflict.field}</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground mb-1">Esperado (PokeAPI):</p>
                    <p className="text-primary font-medium">{conflict.expected}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Informado:</p>
                    <p className="text-primary font-medium">{conflict.actual}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setShowConflictModal(false)}
              className="bg-transparent border-white/10 hover:bg-white/5 text-primary"
            >
              Voltar e Corrigir
            </Button>
            <Button 
              onClick={handleProceed}
              className="bg-red hover:bg-red/80 text-white border-none"
            >
              Prosseguir Assim Mesmo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
