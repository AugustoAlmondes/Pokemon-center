"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiRequestError, pokeApi } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import type { Pokemon } from "@/app/dashboard/page";
import { typeColorMap } from "./constants";
import { RiLoader2Fill } from "react-icons/ri";
import { BsArrowBarLeft } from "react-icons/bs";
import { CgArrowLeft } from "react-icons/cg";
import { getPokemonTypePT, getTypeColor } from "@/lib/pokemon-utils";

interface PokeAPIData {
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  moves: { move: { name: string } }[];
  species: { url: string };
}

interface EvolutionChain {
  species: { name: string };
  evolves_to: EvolutionChain[];
}

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user, loading: authLoading } = useAuth();

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [pokeApiData, setPokeApiData] = useState<PokeAPIData | null>(null);
  const [evolutions, setEvolutions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
    if (id) {
      fetchData();
    }
  }, [id, user, authLoading]);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await api<Pokemon>(`/pokemon/${id}`, { auth: true });
      setPokemon(data);

      // Fetch PokeAPI data
      try {
        const pData = await pokeApi<PokeAPIData>(`/pokemon/${data.name.toLowerCase().trim()}`);
        setPokeApiData(pData);

        // Fetch Evolutions
        const speciesData = await pokeApi<any>(pData.species.url);
        const evoData = await pokeApi<any>(speciesData.evolution_chain.url);

        const chain: string[] = [];
        let current = evoData.chain;

        while (current) {
          chain.push(current.species.name);
          current = current.evolves_to[0];
        }

        const currentIndex = chain.indexOf(data.name.toLowerCase());
        if (currentIndex !== -1) {
          setEvolutions(chain.slice(currentIndex + 1));
        } else {
          setEvolutions(chain);
        }
      } catch (pokeErr) {
        console.error("PokeAPI error or mapping issue:", pokeErr);
      }
    } catch (err) {
      setError("Pokémon não encontrado.");
    } finally {
      setLoading(false);
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-bg-base">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <img src="/gif/loading.gif" alt="loading" className="w-20 h-20" />
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-bg-base">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 mt-10">
          <div className="error-alert">{error || "Não foi possível carregar o Pokémon."}</div>
          <Link href="/dashboard" className="text-accent hover:underline flex items-center gap-2 mt-4">
            ← Voltar para Pokédex
          </Link>
        </div>
      </div>
    );
  }

  const primaryType = pokemon.type.toLowerCase().split(",")[0].trim();
  const gradientClass = typeColorMap[primaryType] || "from-gray-700 to-gray-900";

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      <main className="max-w-4xl mx-auto pb-20 overflow-hidden">
        {/* Top Gradient Header */}
        <div className={`relative h-80 w-full bg-linear-to-br ${gradientClass} flex items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-bg-base to-transparent" />

          {pokeApiData?.sprites.other["official-artwork"].front_default ? (
            <img
              src={pokeApiData.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
              className="w-64 h-64 object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform animate-float"
            />
          ) : (
            <div className="text-white/20 text-9xl font-bold opacity-10">?</div>
          )}

          <Link href="/dashboard" className="absolute top-6 left-6 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition-colors">
            <CgArrowLeft size={24} />
          </Link>
        </div>

        <div className="px-6 -mt-10 relative z-20">
          {/* Name and Type */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-5xl font-bold font-rajdhani uppercase tracking-tight text-white">{pokemon.name}</h1>
              <div className="flex gap-2 mt-2">
                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest shadow-lg ${getTypeColor(pokemon.type)}`}>
                  {getPokemonTypePT(pokemon.type)}
                </span>
                {pokemon.typeTwo && (
                   <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest shadow-lg ${getTypeColor(pokemon.typeTwo)}`}>
                   {getPokemonTypePT(pokemon.typeTwo)}
                 </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-white/30 font-rajdhani text-6xl font-black">#{String(pokemon.pokedexNumber).padStart(3, '0')}</span>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Basic Stats */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-bg-surface backdrop-blur-xl border border-border p-6 rounded-2xl">
                <h3 className="text-xs uppercase font-bold text-accent mb-4 tracking-widest">Atributos</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground uppercase font-semibold">Nível</span>
                      <span className="text-primary font-bold">{pokemon.level}</span>
                    </div>
                    <Progress value={pokemon.level} className="h-1 bg-white/5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground uppercase font-semibold">HP Saudável</span>
                      <span className="text-primary font-bold text-green-400">{pokemon.hp} / {pokemon.hp} HP</span>
                    </div>
                    <Progress value={100} className="h-1 bg-white/5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Additional Info from PokeAPI */}
            <div className="md:col-span-2 space-y-6">
              {pokeApiData ? (
                <>
                  {/* Abilities & Moves */}
                  <div className="bg-bg-surface backdrop-blur-xl border border-border p-6 rounded-2xl">
                    <h3 className="text-xs uppercase font-bold text-accent mb-4 tracking-widest">Principais Ataques & Habilidades</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-[10px] uppercase font-bold mb-2">Habilidades</p>
                        <div className="flex flex-wrap gap-2">
                          {pokeApiData.abilities.slice(0, 3).map(a => (
                            <span key={a.ability.name} className="px-2 py-1 bg-white/5 border border-white/5 rounded text-xs capitalize">{a.ability.name}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[10px] uppercase font-bold mb-2">Jogadas</p>
                        <div className="flex flex-wrap gap-2">
                          {pokeApiData.moves.slice(0, 4).map(m => (
                            <span key={m.move.name} className="px-2 py-1 bg-white/5 border border-white/5 rounded text-xs capitalize">{m.move.name.replace('-', ' ')}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Evolutions */}
                  {evolutions.length > 0 && (
                    <div className="bg-bg-surface backdrop-blur-xl border border-border p-6 rounded-2xl">
                      <h3 className="text-xs uppercase font-bold text-accent mb-4 tracking-widest">Próximas Evoluções</h3>
                      <div className="flex items-center gap-4">
                        {evolutions.map((evo) => (
                          <div key={evo} className="flex items-center gap-4">
                            <div className="group relative">
                              <div className="absolute -inset-2 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                              <p className="relative capitalize bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold text-primary">{evo}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-bg-surface backdrop-blur-xl border border-border p-8 rounded-2xl text-center">
                  <p className="text-muted-foreground italic">Este Pokémon foi adicionado manualmente e não possui registros oficiais no banco de dados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
