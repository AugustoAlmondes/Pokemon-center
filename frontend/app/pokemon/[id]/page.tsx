"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiRequestError } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import type { Pokemon } from "@/app/dashboard/page";

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
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.name.toLowerCase().trim()}`);
      if (response.ok) {
        const pData = await response.json();
        setPokeApiData(pData);

        // Fetch Evolutions
        const speciesRes = await fetch(pData.species.url);
        if (speciesRes.ok) {
          const speciesData = await speciesRes.json();
          const evoRes = await fetch(speciesData.evolution_chain.url);
          if (evoRes.ok) {
            const evoData = await evoRes.json();
            const chain: string[] = [];
            let current = evoData.chain;
            
            while (current) {
              chain.push(current.species.name);
              current = current.evolves_to[0];
            }
            
            // Filter out current pokemon and previous ones if we want "next evolutions"
            const currentIndex = chain.indexOf(data.name.toLowerCase());
            if (currentIndex !== -1) {
              setEvolutions(chain.slice(currentIndex + 1));
            } else {
                setEvolutions(chain);
            }
          }
        }
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
          <span className="spinner w-8 h-8 border-4" />
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

  const typeColorMap: Record<string, string> = {
    fire: "from-orange-500 to-red-600",
    water: "from-blue-400 to-blue-600",
    grass: "from-green-400 to-green-600",
    electric: "from-yellow-300 to-yellow-500",
    psychic: "from-pink-400 to-purple-600",
    ice: "from-cyan-200 to-blue-300",
    dragon: "from-indigo-500 to-purple-800",
    dark: "from-gray-700 to-black",
    fairy: "from-pink-300 to-pink-500",
    normal: "from-gray-300 to-gray-500",
    fighting: "from-red-700 to-red-900",
    poison: "from-purple-500 to-purple-900",
    ground: "from-yellow-600 to-yellow-800",
    flying: "from-indigo-300 to-indigo-500",
    bug: "from-lime-400 to-lime-600",
    rock: "from-stone-500 to-stone-700",
    ghost: "from-purple-800 to-indigo-950",
    steel: "from-slate-400 to-slate-600",
  };

  const primaryType = pokeApiData?.types[0]?.type.name || pokemon.type.toLowerCase().split(",")[0].trim();
  const gradientClass = typeColorMap[primaryType] || "from-gray-700 to-gray-900";

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />
      
      <main className="max-w-4xl mx-auto pb-20 overflow-hidden">
        {/* Top Gradient Header */}
        <div className={`relative h-80 w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden`}>
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-base to-transparent" />
           
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
           </Link>
        </div>

        <div className="px-6 -mt-10 relative z-20">
            {/* Name and Type */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-5xl font-bold font-rajdhani uppercase tracking-tight text-white">{pokemon.name}</h1>
                    <div className="flex gap-2 mt-2">
                        {pokemon.type.split(",").map(t => (
                            <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.trim()}</span>
                        ))}
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
                                        {evolutions.map((evo, idx) => (
                                            <div key={evo} className="flex items-center gap-4">
                                                <div className="group relative">
                                                    <div className="absolute -inset-2 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <p className="relative capitalize bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold text-primary">{evo}</p>
                                                </div>
                                                {idx < evolutions.length - 1 && (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-bg-surface backdrop-blur-xl border border-border p-8 rounded-2xl text-center">
                            <p className="text-muted-foreground italic">Este Pokémon foi adicionado manualmente e não possui registros oficiais no banco de dados PokeAPI para informações adicionais.</p>
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
