"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiRequestError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { redirect } from "next/navigation";

import { Progress } from "@/components/ui/progress";

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

  async function handleDelete(e: React.MouseEvent, id: string | number) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Tem certeza que deseja deletar este Pokémon?")) return;

    try {
      await api(`/pokemon/${id}`, {
        method: "DELETE",
        auth: true, 
      });
      // Remove from UI
      setPokemons((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof ApiRequestError ? err.message : "Erro ao deletar Pokémon");
    }
  }

  if (authLoading) {
    return <div style={{ minHeight: "100vh", background: "var(--bg-base)" }} />;
  }

  if (!user) {
    return null; // Redirecting in useEffect
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
          <div className="error-alert" role="alert" style={{ marginBottom: "2rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
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
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: "0 auto 1rem", opacity: 0.5 }}>
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            <p>A Pokédex está vazia. Seja o primeiro a adicionar um Pokémon!</p>
          </div>
        ) : (
          <div className="pokemon-grid">
            {pokemons.map((pokemon) => {
              const isOwner = userId && pokemon.createdBy && String(userId) === String(pokemon.createdBy);
              const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedexNumber}.png`;

              return (
                <Link key={pokemon.id} href={`/pokemon/${pokemon.id}`} className="pokemon-card block">
                  <div className="pokemon-card-header">
                    <div>
                      <h2 className="pokemon-name">{pokemon.name}</h2>
                      <span className="pokemon-type-badge">{pokemon.type}</span>
                    </div>
                    <span className="pokemon-number">#{String(pokemon.pokedexNumber).padStart(3, "0")}</span>
                  </div>

                  <div className="relative group flex justify-center py-2">
                    <div className="absolute inset-0 bg-red/5 rounded-full blur-2xl group-hover:bg-red/10 transition-colors" />
                    <img 
                      src={spriteUrl} 
                      alt={pokemon.name} 
                      className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
                      }}
                    />
                  </div>

                  <div className="pokemon-stats">
                    <div className="stat-item flex justify-between items-center mb-1">
                      <span className="stat-label text-xs uppercase text-muted-foreground font-bold">Nível</span>
                      <span className="stat-value font-bold text-accent">Lv. {pokemon.level}</span>
                    </div>
                    
                    <div className="space-y-1 mt-3">
                      <div className="flex justify-between text-[10px] items-center px-1">
                        <span className="uppercase font-bold text-muted-foreground">HP Mínimo</span>
                        <span className="font-bold text-primary">{pokemon.hp} / {pokemon.hp} HP</span>
                      </div>
                      <Progress value={100} className="h-1.5 bg-black/40" />
                    </div>
                  </div>

                  {isOwner && (
                    <div className="pokemon-actions flex gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = `/pokemon/edit/${pokemon.id}`;
                        }}
                        className="pokemon-action-btn flex-1 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, pokemon.id)}
                        className="pokemon-action-btn flex-1 py-2 rounded-lg bg-red/10 border border-red/20 hover:bg-red/20 text-red text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Deletar
                      </button>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
