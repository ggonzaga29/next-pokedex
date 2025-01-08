import { fetchPaginatedPokemonList } from "src/lib/data";
import Image from "next/image";
import PokemonListGrid from "src/components/PokemonList/PokemonListGrid";
import PokemonSearchInput from "src/components/PokemonSearchInput";
import { PokemonProvider } from "src/context/PokemonSearchContext";

export const metadata = {
  title: "Pokedex",
  description: "A Pokédex for Next.js",
};

export default async function Home() {
  const pokemonList = await fetchPaginatedPokemonList({
    limit: 20,
    offset: 0,
  });

  return (
    <PokemonProvider initialData={pokemonList}>
      <div className="flex flex-col items-center py-16">
        <div className="w-full">
          <Image
            src="/Pokedex_Logo.png"
            alt="Pokedex Logo"
            width={495}
            height={152}
            className="mx-auto"
          />
          {/* Search & Filters */}
          <PokemonSearchInput />

          {/* Pokemon List */}
          <PokemonListGrid />
        </div>
      </div>
    </PokemonProvider>
  );
}

export const revalidate = 300;
