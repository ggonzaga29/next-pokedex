"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { PokeAPI } from "pokeapi-types";

type Pokemon = PokeAPI.Pokemon;

interface PokemonContextType {
  data: Pokemon[];
  isLoading: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  fetchPokemon: (isLoadMore?: boolean) => void;
  canLoadMore: boolean;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider = ({
  initialData,
  children,
}: {
  children: ReactNode;
  initialData: Pokemon[];
}) => {
  const [data, setData] = useState<Pokemon[]>(initialData);
  const [offset, setOffset] = useState<number>(initialData.length);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const canLoadMore = useMemo(() => data.length >= offset, [data, offset]);

  const fetchPokemon = useCallback(
    async (isLoadMore: boolean = false) => {
      if (isLoading) return;
      setIsLoading(true);

      let query = `?offset=${isLoadMore ? offset : 0}&limit=20`;
      if (searchValue) {
        query += `&query=${searchValue}`;
      }

      try {
        const response = await fetch(`/api/pokemon${query}`);
        const { results }: { results: { name: string; url: string }[] } =
          await response.json();

        const newPokemonData: Pokemon[] = await Promise.all(
          results.map(async (result) => {
            const pokemonResponse = await fetch(result.url);
            return await pokemonResponse.json();
          })
        );

        if (searchValue && !isLoadMore) {
          setData(newPokemonData);
        } else {
          setData((prevData) => [...prevData, ...newPokemonData]);
          setOffset((prevOffset) => prevOffset + newPokemonData.length);
        }
      } catch (error) {
        console.error("Failed to fetch Pokémon:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [offset, searchValue, isLoading]
  );

  useEffect(() => {
    if (!isFirstRender) {
      setData([]);
      setOffset(initialData.length);
      fetchPokemon(false); // Trigger fetch when searchValue changes
    }

    setIsFirstRender(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <PokemonContext.Provider
      value={{
        data,
        isLoading,
        fetchPokemon,
        canLoadMore,
        searchValue,
        setSearchValue,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error("usePokemon must be used within a PokemonProvider");
  }
  return context;
};
