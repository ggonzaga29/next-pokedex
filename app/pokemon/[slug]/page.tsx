import { cva, VariantProps } from "class-variance-authority";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TypeBadge, { TypeBadgeProps } from "src/components/TypeBadge";
import {
  fetchPokemon,
  fetchPokemonFlavorText,
  fetchPokemonIndex,
} from "src/lib/data";
import { cn, formatToTitleCase, statAbbreviations } from "src/lib/utils";

export async function generateStaticParams() {
  const pokemonIndex = await fetchPokemonIndex({
    limit: 1500,
  });

  return pokemonIndex.results.map((pokemon) => ({
    slug: pokemon.name,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const pokemon = await fetchPokemon(slug);

  if (!pokemon) {
    return {
      notFound: true,
    };
  }

  return {
    title: `Next Pokedex | ${pokemon.name.toUpperCase()}`,
    description: `Pokemon ${pokemon.name}, #${pokemon.id}, is a ${pokemon.types.map((type) => type.type.name).join(", ")} Pokémon.`,
    keywords: [
      "Pokedex",
      "Pokémon",
      pokemon.name,
      pokemon.types.map((type) => type.type.name).join(", "),
    ],
    openGraph: {
      images: pokemon.sprites.front_default,
    },
  };
}

const statCls = cva("", {
  variants: {
    stat: {
      hp: "bg-red-500",
      attack: "bg-orange-500",
      defense: "bg-yellow-500",
      "special-attack": "bg-blue-500",
      "special-defense": "bg-green-300",
      speed: "bg-pink-300",
    },
  },
  defaultVariants: {
    stat: "hp",
  },
});

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const pokemon = await fetchPokemon(slug);
  const flavorText = await fetchPokemonFlavorText(slug);
  // To remove unicode characters
  const cleanFlavorText = flavorText
    ? flavorText[0].flavor_text.replace(/[\x00-\x1F\x7F-\x9F]/g, "")
    : "";

  if (!pokemon) return notFound();

  const previousId = pokemon.id !== 1 ? pokemon.id - 1 : null;
  const nextId = pokemon.id + 1;

  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <Link
          href="/"
          className="flex items-center gap-2 hover:underline text-lg text-white mb-4 group"
        >
          <ArrowLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="grid grid-cols-2 gap-12 w-full bg-white rounded-2xl p-12">
          <div className="flex items-center justify-center">
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
              alt={pokemon.name}
              width={400}
              height={400}
              className="size-[400px]"
              priority
            />
          </div>
          <div className="">
            <h2 className="font-bold">#00{pokemon.id}</h2>
            <h1 className="text-4xl font-bold mt-2">
              {formatToTitleCase(pokemon.name)}
            </h1>

            <div className="flex flex-wrap gap-2 mt-2">
              {pokemon.types.map((type) => (
                <TypeBadge
                  key={type.type.name}
                  type={type.type.name as TypeBadgeProps["type"]}
                />
              ))}
            </div>

            {/* Flavor Text */}
            <p className="mt-4">{cleanFlavorText}</p>

            {/* Height and Weight */}
            <div className="flex gap-6 items-center mt-4 max-w-sm w-full">
              <div className="bg-[#BFC66B] p-3 flex items-center justify-between rounded-lg flex-1">
                <p className="text-lg font-bold">Height</p>
                <span className="text-lg">0.{pokemon.height}m</span>
              </div>
              <div className="bg-[#BFC66B] p-3 flex items-center justify-between rounded-xl flex-1">
                <p className="text-lg font-bold">Weight</p>
                <span className="text-lg">{pokemon.weight}hg</span>
              </div>
            </div>

            <h3 className="text-lg font-bold my-4">Stats</h3>
            <div className="grid grid-cols-2 gap-6 items-center max-w-sm w-full">
              {pokemon.stats.map((stat) => (
                <div
                  key={stat.stat.name}
                  className={cn(
                    statCls({
                      stat: stat.stat.name as VariantProps<
                        typeof statCls
                      >["stat"],
                    }),
                    "p-3 flex items-center justify-between rounded-xl flex-1"
                  )}
                >
                  <p className="text-lg font-bold">
                    {statAbbreviations(stat.stat.name)}
                  </p>

                  <span className="text-lg">{stat.base_stat}</span>
                </div>
              ))}
            </div>

            {/* Abilities */}
            <h3 className="text-lg font-bold my-4">Abilities</h3>
            <div className="grid grid-cols-2 gap-6 items-center max-w-sm w-full">
              {pokemon.abilities.map((ability) => (
                <div
                  key={ability.ability.name}
                  className="bg-[#BFC66B] p-3 flex items-center justify-center rounded-xl flex-1"
                >
                  <p className="text-lg font-bold">
                    {formatToTitleCase(ability.ability.name)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {pokemon.id !== 1 ? (
            <Link
              href={`/pokemon/${previousId}`}
              className="flex items-center gap-2 hover:underline text-lg text-white group"
            >
              <ArrowLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
              Previous
            </Link>
          ) : (
            <>&nbsp;</>
          )}

          <Link
            href={`/pokemon/${nextId}`}
            className="flex items-center gap-2 hover:underline text-lg text-white group"
          >
            Next
            <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
