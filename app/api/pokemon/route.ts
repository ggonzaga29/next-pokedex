import { NextResponse } from "next/server";
import { PokeAPI } from "pokeapi-types";

const POKEMON_API = "https://pokeapi.co/api/v2";
const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = searchParams.get("offset") || DEFAULT_OFFSET;
  const limit = searchParams.get("limit") || DEFAULT_LIMIT;
  const query = searchParams.get("query")?.toLowerCase() || "";
  // If false, it will only return the named resourcel list
  const details = searchParams.get("details")?.toLowerCase() === "true";

  try {
    // if query then limit is ignored

    const actualLimit = query ? 1500 : limit;

    const response = await fetch(
      `${POKEMON_API}/pokemon?offset=${offset}&limit=${actualLimit}`,
      {
        next: {
          // 8 hour cache
          revalidate: 60 * 60 * 8,
          // Don't need this at all
          // tags: ["pokemon", query, details ? "details" : ""],
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: 500 }
      );
    }

    const data: PokeAPI.NamedAPIResourceList = await response.json();
    const results = data.results.filter((result) =>
      result.name.toLowerCase().includes(query)
    );

    if (!details) {
      return NextResponse.json({
        count: data.count,
        next: data.next,
        previous: data.previous,
        results: results,
      });
    }

    console.log(results.map((result) => result.name));

    const pokemonDetails = await Promise.all(
      results.map(async (result) => {
        const response = await fetch(
          `${POKEMON_API}/pokemon/${result.name.toLowerCase()}`
        );

        if (!response.ok) {
          return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500 }
          );
        }

        const data: PokeAPI.NamedAPIResource = await response.json();

        return data;
      })
    );

    return NextResponse.json({
      next: data.next,
      previous: data.previous,
      results: pokemonDetails,
      count: data.count,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" + error },
      { status: 500 }
    );
  }
} 