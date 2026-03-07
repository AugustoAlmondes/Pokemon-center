"use client";

import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { PokemonForm } from "@/components/PokemonForm";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiRequestError } from "@/lib/api";
import type { Pokemon } from "@/app/dashboard/page";

export default function EditPokemonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { user, loading: authLoading, getUserId } = useAuth();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = getUserId();

  useEffect(() => {
    if (!authLoading && !user) {
      redirect("/login");
    }

    if (user && id) {
      fetchPokemon();
    }
  }, [user, authLoading, id]);

  async function fetchPokemon() {
    try {
      const data = await api<Pokemon>(`/pokemon/${id}`, { auth: true });
      
      if (String(data.createdBy) !== String(userId)) {
        alert("Sem permissão para editar este Pokémon.");
        router.push("/dashboard");
        return;
      }
      
      setPokemon(data);
    } catch (err) {
      setError("Pokémon não encontrado.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: any) {
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await api(`/pokemon/${id}`, {
        method: "PATCH",
        body: data,
        auth: true,
      });
      
      setSuccess("Pokémon atualizado com sucesso!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      if (err instanceof ApiRequestError) setError(err.message);
      else setError("Erro inesperado ao atualizar Pokémon.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <Navbar />
        <main className="dashboard-root" style={{ maxWidth: "800px", display: "flex", justifyContent: "center", paddingTop: "4rem" }}>
          <span className="spinner" style={{ width: "32px", height: "32px", borderWidth: "3px" }} />
        </main>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <Navbar />
        <main className="dashboard-root" style={{ maxWidth: "800px" }}>
          <div className="error-alert" role="alert">
            {error || "Erro ao carregar dados do Pokémon."}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <main className="dashboard-root" style={{ maxWidth: "800px" }}>
        <header className="dashboard-header" style={{ justifyContent: "center" }}>
          <h1 className="dashboard-title">Editar Pokémon</h1>
        </header>

        <PokemonForm 
          initialData={pokemon}
          onSubmit={handleSubmit} 
          isLoading={submitting} 
          serverError={error} 
          successMessage={success}
          submitLabel="Salvar Alterações" 
        />
      </main>
    </div>
  );
}
