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
  const translations: Record<string, string> = {
    "fire": "fogo",
    "water": "água",
    "grass": "grama",
    "electric": "elétrico",
    "ice": "gelo",
    "fighting": "lutador",
    "poison": "veneno",
    "ground": "terra",
    "flying": "voador",
    "psychic": "psíquico",
    "bug": "inseto",
    "rock": "pedra",
    "ghost": "fantasma",
    "dragon": "dragão",
    "dark": "sombrio",
    "steel": "aço",
    "fairy": "fada",
    "normal": "normal",
  };

  const normalized = typeEN.toLowerCase().trim();
  return translations[normalized] || normalized;
};
