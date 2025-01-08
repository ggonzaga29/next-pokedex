"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { usePokemon } from "src/context/PokemonSearchContext";

const PokemonSearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSearchValue } = usePokemon();

  return (
    <div className="mt-12 flex gap-4 w-full">
      <Input
        placeholder="E.g. Pikachu, Charmander, Bulbasaur"
        className="bg-white h-[4rem] rounded-xl border-none flex-1 shadow-xl"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button
        className="bg-primary size-[4rem] rounded-xl bg-[#FF5350] hover:bg-[#FF5350]/[0.8] transition-colors"
        onClick={() => {
          setSearchValue(search);
        }}
      >
        <Search className="w-8 h-8" />
      </Button>
    </div>
  );
};

export default PokemonSearchInput;
