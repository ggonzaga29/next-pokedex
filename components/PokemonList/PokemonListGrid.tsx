"use client";

import PokemonListItem from "src/components/PokemonList/PokemonListItem";
import { Button } from "src/components/ui/button";
import { Skeleton } from "src/components/ui/skeleton";
import { usePokemon } from "src/context/PokemonSearchContext";

const PokemonListGrid = () => {
  const { data, fetchPokemon, isLoading, canLoadMore } = usePokemon();

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 lg:px-0 px-4 grid-cols-2 gap-12 mt-24 w-full">
      {data.map((pokemon) => (
        <PokemonListItem key={pokemon.id} pokemon={pokemon} />
      ))}

      {isLoading && (
        <>
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton key={i} className="h-[164px]" />
          ))}
        </>
      )}

      {canLoadMore && (
        <div className="flex items-center justify-center col-span-full">
          <Button
            onClick={() => fetchPokemon(true)}
            className="bg-primary h-[4rem] rounded-xl bg-[#FF5350] hover:bg-[#FF5350]/[0.8] transition-colors"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default PokemonListGrid;
