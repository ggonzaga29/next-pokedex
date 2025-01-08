import type { PokeAPI } from "pokeapi-types";

const BASE_URL =
  process.env.NEXT_PUBLIC_POKEAPI_URL || "https://pokeapi.co/api/v2";

export const fetchPokemonIndex = async ({
  limit = 20,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}): Promise<PokeAPI.NamedAPIResourceList> => {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
  const data = await response.json();
  return data;
};

export const fetchPokemonFlavorText = async (
  name: string
): Promise<PokeAPI.PokemonSpecies["flavor_text_entries"] | null> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon-species/${name}`);

    if (!response.ok) {
      if (response.status === 404) {
        // console.log(`Pokemon Species "${name}" not found`);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PokeAPI.PokemonSpecies = await response.json();
    return data.flavor_text_entries;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchPaginatedPokemonList = async ({
  limit = 20,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}): Promise<PokeAPI.Pokemon[]> => {
  const index = await fetchPokemonIndex({ limit, offset });

  const pokemonPromises = index.results.map(async (pokemon) => {
    const pokemonResponse = await fetch(pokemon.url);
    if (!pokemonResponse.ok) throw new Error("Failed to fetch Pokémon data");
    const pokemonData = await pokemonResponse.json();

    const speciesResponse = await fetch(pokemonData.species.url);
    if (!speciesResponse.ok) throw new Error("Failed to fetch species data");
    const speciesData = await speciesResponse.json();

    return {
      ...pokemonData,
      flavor_text_entries: speciesData.flavor_text_entries,
    };
  });

  const pokemonList = await Promise.all(pokemonPromises);

  return pokemonList;
};

export const fetchPokemon = async (
  name: string
): Promise<PokeAPI.Pokemon | null> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${name}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Pokemon "${name}" not found`);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokemon:", error);
    return null;
  }
};