export const POKEMON_TYPE_TRANSLATIONS: Record<string, string> = {
  "water": "água",
  "steel": "aço",
  "dragon": "dragão",
  "electric": "elétrico",
  "fairy": "fada",
  "ghost": "fantasma",
  "fire": "fogo",
  "ice": "gelo",
  "grass": "grama",
  "bug": "inseto",
  "fighting": "lutador",
  "normal": "normal",
  "rock": "pedra",
  "psychic": "psíquico",
  "dark": "sombrio",
  "ground": "terra",
  "poison": "veneno",
  "flying": "voador",
};

export const translatePokemonType = (type: string): string => {
  const translations: Record<string, string> = {
    "fogo": "fire",
    "água": "water",
    "grama": "grass",
    "elétrico": "electric",
    "gelo": "ice",
    "lutador": "fighting",
    "veneno": "poison",
    "terra": "ground",
    "voador": "flying",
    "psíquico": "psychic",
    "inseto": "bug",
    "pedra": "rock",
    "fantasma": "ghost",
    "dragão": "dragon",
    "sombrio": "dark",
    "aço": "steel",
    "fada": "fairy",
    "normal": "normal",
  };

  const normalized = type.toLowerCase().trim();
  return translations[normalized] || normalized;
};

export const getPokemonTypePT = (typeEN: string): string => {
  const normalized = typeEN?.toLowerCase().trim();
  return POKEMON_TYPE_TRANSLATIONS[normalized] || normalized;
};

export const getTypeColor = (typeEN: string): string => {
  const colors: Record<string, string> = {
    fire: "bg-orange-500 text-white",
    water: "bg-blue-500 text-white",
    grass: "bg-green-500 text-white",
    electric: "bg-yellow-400 text-black",
    ice: "bg-cyan-300 text-black",
    fighting: "bg-red-700 text-white",
    poison: "bg-purple-600 text-white",
    ground: "bg-yellow-700 text-white",
    flying: "bg-indigo-400 text-white",
    psychic: "bg-pink-500 text-white",
    bug: "bg-lime-500 text-white",
    rock: "bg-stone-600 text-white",
    ghost: "bg-indigo-900 text-white",
    dragon: "bg-indigo-700 text-white",
    dark: "bg-gray-800 text-white",
    steel: "bg-slate-500 text-white",
    fairy: "bg-pink-400 text-white",
    normal: "bg-gray-400 text-white",
  };
  return colors[typeEN?.toLowerCase().trim()] || "bg-gray-500 text-white";
};

