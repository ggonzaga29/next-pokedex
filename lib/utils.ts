import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToTitleCase(title: string) {
  return title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const typeColors: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export function getTypeColor(type: string): string {
  return typeColors[type.toLowerCase()] || "#000000"; // Default to black if type is not found
}

export function statAbbreviations(stat: string): string {
  const abbreviations: Record<string, string> = {
    "hp": "HP",
    "attack": "ATK",
    "defense": "DEF",
    "special-attack": "SpA",
    "special-defense": "SpD",
    "speed": "SPD",
  };

  return abbreviations[stat.toLowerCase()] || stat;
}