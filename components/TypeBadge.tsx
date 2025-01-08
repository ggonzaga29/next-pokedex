import React from "react";
import { cva, VariantProps } from "class-variance-authority";

export const typeClass = cva("rounded-full p-1 text-white text-sm", {
  variants: {
    type: {
      normal: "bg-gray-400",
      fire: "bg-red-600",
      water: "bg-blue-600",
      electric: "bg-yellow-400",
      grass: "bg-green-500",
      ice: "bg-blue-300",
      fighting: "bg-red-700",
      poison: "bg-purple-600",
      ground: "bg-yellow-700",
      flying: "bg-indigo-400",
      psychic: "bg-pink-600",
      bug: "bg-green-600",
      rock: "bg-yellow-600",
      ghost: "bg-purple-700",
      dragon: "bg-purple-800",
      dark: "bg-gray-800",
      steel: "bg-gray-500",
      fairy: "bg-pink-400",
    },
  },
  defaultVariants: {
    type: "normal",
  },
});

export type TypeBadgeProps = VariantProps<typeof typeClass>;

const TypeBadge: React.FC<TypeBadgeProps> = ({ type = "normal" }) => {
  return <span className={typeClass({ type })}>{type}</span>;
};

export default TypeBadge;
