"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiRequestError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { redirect } from "next/navigation";

import { Progress } from "@/components/ui/progress";
import DashboardCard from "@/components/DashboardCard";
import { ConfirmModal } from "@/components/ConfirmModal";

export interface Pokemon {
  id: string | number;
  name: string;
  type: string;
  level: number;
  hp: number;
  pokedexNumber: number;
  createdBy: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading, getUserId } = useAuth();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pokemonToDelete, setPokemonToDelete] = useState<string | number | null>(null);

  const userId = getUserId();

  useEffect(() => {
    // If auth finishes loading and there's no user, redirect to login
    if (!authLoading && !user) {
      redirect("/login");
    }

    if (user) {
      fetchPokemons();
    }
  }, [user, authLoading]);

  async function fetchPokemons() {
    try {
      setLoading(true);
      setError("");
      const data = await api<Pokemon[]>("/pokemon", { auth: true });
      setPokemons(data || []);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Erro ao carregar a Pokédex.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteClick(e: React.MouseEvent, id: string | number) {
    e.preventDefault();
    e.stopPropagation();
    setPokemonToDelete(id);
    setIsDeleteModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (!pokemonToDelete) return;

    try {
      await api(`/pokemon/${pokemonToDelete}`, {
        method: "DELETE",
        auth: true,
      });
      // Remove from UI
      setPokemons((prev) => prev.filter((p) => p.id !== pokemonToDelete));
    } catch (err) {
      alert(err instanceof ApiRequestError ? err.message : "Erro ao deletar Pokémon");
    } finally {
      setPokemonToDelete(null);
    }
  }


  if (authLoading) {
    return <div style={{ minHeight: "100vh", background: "var(--bg-base)" }} />;
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <main className="dashboard-root">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Pokédex Global</h1>
          <Link href="/pokemon/create" className="navbar-btn navbar-btn--primary">
            + Novo Pokémon
          </Link>
        </header>

        {error && (
          <div className="error-alert" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="pokemon-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="pokemon-card animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-6 w-24 bg-white/10 rounded" />
                  <div className="h-6 w-12 bg-white/10 rounded-full" />
                </div>
                <div className="aspect-square w-32 mx-auto bg-white/5 rounded-full mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : pokemons.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <img src="/gif/pokebola_open.gif" className="w-30 h-30 mb-10" />
            <p className="text-text-base">A Pokédex está vazia. Seja o primeiro a adicionar um Pokémon!</p>
          </div>
        ) : (
          <div className="pokemon-grid">
            {pokemons.map((pokemon) => {
              return (
                <DashboardCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  userId={userId}
                  handleDelete={handleDeleteClick}
                />
              )
            })}
          </div>
        )}
      </main>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Deletar Pokémon"
        description="Tem certeza que deseja deletar este Pokémon? Esta ação não pode ser desfeita."
      />
    </div>
  );
}

