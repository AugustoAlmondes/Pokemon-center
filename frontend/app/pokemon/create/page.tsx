"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PokemonForm } from "@/components/PokemonForm";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiRequestError } from "@/lib/api";
import { redirect } from "next/navigation";

export default function CreatePokemonPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (authLoading) return <div style={{ minHeight: "100vh", background: "var(--bg-base)" }} />;
  if (!user) {
    redirect("/login");
  }

  async function handleSubmit(data: any) {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api("/pokemon", {
        method: "POST",
        body: data,
        auth: true,
      });

      setSuccess("Pokémon cadastrado com sucesso!");
      setTimeout(() => {
        redirect("/dashboard");
      }, 1500);
    } catch (err) {
      if (err instanceof ApiRequestError) setError(err.message);
      else setError("Erro inesperado ao criar Pokémon.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <main className="dashboard-root" style={{ maxWidth: "800px" }}>
        <header className="dashboard-header" style={{ justifyContent: "center" }}>
          <h1 className="dashboard-title">Adicionar à Pokédex</h1>
        </header>

        <PokemonForm
          onSubmit={handleSubmit}
          isLoading={loading}
          serverError={error}
          successMessage={success}
          submitLabel="Registrar Pokémon"
        />
      </main>
    </div>
  );
}
