"use client";

import Link from "next/link";
import { Pokemon } from "@/app/dashboard/page";
import { MdModeEditOutline, MdOutlineDelete } from "react-icons/md";
import { Progress } from "./ui/progress";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pokeApi } from "@/lib/api";

export interface DashboardCardProps {
    pokemon: Pokemon,
    userId: string | null,
    handleDelete: (e: React.MouseEvent, id: string | number) => void
}

export default function DashboardCard({ pokemon, userId, handleDelete }: DashboardCardProps) {
    const router = useRouter();
    const [pokemonPicture, setPokemonPicture] = useState<string | null>(null);

    const isOwner = userId && pokemon.createdBy && String(userId) === String(pokemon.createdBy);
    useEffect(() => {
        async function getPokemonPicture() {
            try {
                const data = await pokeApi<{ sprites: { front_default: string } }>(`/pokemon/${pokemon.name.toLowerCase()}`);
                if (data.sprites.front_default) {
                    setPokemonPicture(data.sprites.front_default);
                }
            } catch (error) {
                console.error("Error fetching pokemon picture:", error);
            }
        }

        getPokemonPicture();
    }, [pokemon.name]);


    return (
        <Link key={pokemon.id} href={`/pokemon/${pokemon.id}`} className="pokemon-card block">
            <div className="pokemon-card-header">
                <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <h2 className="pokemon-name">{pokemon.name}</h2>
                        {
                            isOwner && (
                                <img src="/pokebola_pixel.png" className="w-8 h-8" />
                            )
                        }
                    </div>
                    <span className="pokemon-type-badge">{pokemon.type}</span>
                </div>
                <span className="pokemon-number">#{String(pokemon.pokedexNumber).padStart(3, "0")}</span>
            </div>

            <div className="relative group flex justify-center py-2">
                <div className="absolute inset-0 bg-red/5 rounded-full blur-2xl group-hover:bg-red/10 transition-colors" />
                {
                    pokemonPicture ?
                        <img
                            src={pokemonPicture}
                            alt={pokemon.name.toLowerCase().trim()}
                            className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300"
                        /> :
                        <img
                            src="/none_pokemon.png"
                            alt={pokemon.name.toLowerCase().trim()}
                            className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300"
                        />
                }
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
                            router.push(`/pokemon/edit/${pokemon.id}`);
                        }}

                        className="pokemon-action-btn flex-1 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-green-500 text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                        <MdModeEditOutline size={16} /> Editar
                    </button>
                    <button
                        onClick={(e) => handleDelete(e, pokemon.id)}
                        className="pokemon-action-btn--delete flex-1 py-2 rounded-lg bg-red/10 border border-red/20 hover:bg-red/20 text-red text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                        <MdOutlineDelete size={16} /> Deletar
                    </button>
                </div>
            )}
        </Link>
    )
}