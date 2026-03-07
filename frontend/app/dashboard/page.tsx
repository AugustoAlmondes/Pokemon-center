"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiRequestError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { redirect } from "next/navigation";

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
      // Using generic pokemon list endpoint. We don't need auth for GET /pokemon based on docs
      // "Pokémon list is global (shared)."
      const data = await api<Pokemon[]>("/pokemon");
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

  async function handleDelete(id: string | number) {
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
              <div key={n} className="skeleton-card" />
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
              // Convert both to string for reliable comparison
              const isOwner = userId && pokemon.createdBy && String(userId) === String(pokemon.createdBy);

              return (
                <article key={pokemon.id} className="pokemon-card">
                  <div className="pokemon-card-header">
                    <div>
                      <h2 className="pokemon-name">{pokemon.name}</h2>
                      <span className="pokemon-type-badge">{pokemon.type}</span>
                    </div>
                    <span className="pokemon-number">#{String(pokemon.pokedexNumber).padStart(3, "0")}</span>
                  </div>

                  <div className="pokemon-stats">
                    <div className="stat-item">
                      <span className="stat-label">Nível</span>
                      <span className="stat-value">Lv. {pokemon.level}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">HP Máximo</span>
                      <span className="stat-value">{pokemon.hp} HP</span>
                    </div>
                  </div>

                  {isOwner && (
                    <div className="pokemon-actions">
                      <Link href={`/pokemon/edit/${pokemon.id}`} className="pokemon-action-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(pokemon.id)}
                        className="pokemon-action-btn pokemon-action-btn--delete"
                        aria-label="Deletar Pokémon"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                        Deletar
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
