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
