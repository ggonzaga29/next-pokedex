"use client";

import { useSearchParams } from "next/navigation";
import { PokeAPI } from "pokeapi-types";
import { useState, useEffect, useCallback } from "react";

type Pokemon = PokeAPI.Pokemon;

export function useFetchPokemon(initialData: Pokemon[]) {
  const [data, setData] = useState<Pokemon[]>(initialData);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const loadMore = async () => {
    if (search) return; // Do not use loadMore when search is active
    fetchPokemonData(offset);
  };

  const fetchPokemonData = useCallback(async (offset: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/pokemon?offset=${offset}&limit=20`);
      const { results }: { results: { name: string; url: string }[] } =
        await response.json();

      const newPokemonData: Pokemon[] = await Promise.all(
        results.map(async (result) => {
          const pokemonResponse = await fetch(result.url);
          return await pokemonResponse.json();
        })
      );

      setData((prevData) => [...prevData, ...newPokemonData]);
      setOffset((prevOffset) => prevOffset + newPokemonData.length);
    } catch (error) {
      console.error("Failed to load more Pokémon:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchPokemon = useCallback(async () => {
    if (!search) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/pokemon?query=${search}`);
      const { results }: { results: { name: string; url: string }[] } =
        await response.json();

      const foundPokemon: Pokemon[] = await Promise.all(
        results.map(async (result) => {
          const pokemonResponse = await fetch(result.url);
          return await pokemonResponse.json();
        })
      );

      setData(foundPokemon);
    } catch (error) {
      console.error("Failed to search Pokémon:", error);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    setData([]);
    setOffset(0);
    if (search) {
      searchPokemon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return { data, loadMore, isLoading, searchPokemon };
}

export default useFetchPokemon;
