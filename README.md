# Next Pokedex

## Setup
I'm using pnpm as the package manager for this project.
```bash
pnpm install # install packages
pnpm dev # to run dev mode
```

You may also build this project as well so it runs better while testing
```bash
pnpm build
pnpm start 
```

## Implementation Details

All pages are statically generated at build time including all the pages for 1307 pokemons. Requests using the api routes are cached for 8 hours since the pokemon data isn't changing that often anyway. SEO Metadata is also generated for the detail pages.

`/` For the home page
`/pokemon/[name]` For the pokemon detail pages