import Link from "next/link";
import { PokeAPI } from "pokeapi-types";
import Image from "next/image";
import { formatToTitleCase } from "src/lib/utils";
import TypeBadge, { TypeBadgeProps } from "src/components/TypeBadge";

const PokemonListItem = ({ pokemon }: { pokemon: PokeAPI.Pokemon }) => {
  return (
    <Link href={`/pokemon/${pokemon.name}`}>
      <div className="bg-white rounded-xl transition-[box-shadow] cursor-pointer shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-2 p-6 relative min-h-[164px]">
        <div className="absolute -top-8">
          <figure className="size-16 relative">
            <Image
              src={`https://projectpokemon.org/images/normal-sprite/${pokemon.name}.gif`}
              alt={pokemon.name}
              width={64}
              height={64}
              className="rounded-xl size-16 object-contain"
              unoptimized
            />
          </figure>
        </div>

        <span className="text-gray-500 font-medium text-bold mt-8">
          No. {pokemon.id}
        </span>
        <h3 className="text-xl font-bold">{formatToTitleCase(pokemon.name)}</h3>

        <div className="flex flex-wrap gap-2 p-1">
          {pokemon.types.map((type) => (
            <TypeBadge
              key={type.type.name}
              type={type.type.name as TypeBadgeProps["type"]}
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default PokemonListItem;
