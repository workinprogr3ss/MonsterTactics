# MonsterTactics

MonsterTactics is a web‑first tactical auto‑battler with capture & exploration, built as a modular monorepo. Battles play out on a **hex grid** with **deterministic ticks**, and the player influences combat using an **Aether gauge** and a **spell deck** instead of mid‑round unit shops. The world is an island archipelago where exploration, weather, and tides matter.

> This README mirrors the bootstrap script layout and folds in the game design spec you drafted (hex boards, Aether gauge, capture‑first progression, Level vs Merge vs Evolution, and an exploration loop).

---

## Table of Contents

* [Overview](#overview)
* [Monorepo Layout](#monorepo-layout)
* [Prerequisites](#prerequisites)
* [Bootstrapping](#bootstrapping)
* [Install & Run](#install--run)
* [Workspace Commands](#workspace-commands)
* [Game Design Snapshot](#game-design-snapshot)
* [Content Packs](#content-packs)
* [AI NPC Layer](#ai-npc-layer)
* [Architecture](#architecture)
* [Testing & CI](#testing--ci)
* [Roadmap & MVP](#roadmap--mvp)
* [Troubleshooting](#troubleshooting)
* [Contributing](#contributing)
* [License](#license)

---

## Overview

**Elevator pitch.** Explore an archipelago from a central town (**Haven**) while a creeping phenomenon (**The Gloom**) reshapes tides and weather. Capture and raise creatures, then deploy them on a **hex‑grid auto‑chess arena**. You manage **synergies, positioning, and a spell deck** powered by a regenerating **Aether** gauge. Boss routes are multi‑round gauntlets; open‑world encounters are short single‑round tests.

**Design pillars.**

* Hex tactics with readable positioning, facing, and terrain.
* Player agency via **spell cards** (no mid‑round unit purchases).
* Exploration drives power: captures, catalysts, traversal unlocks, LLM quests.
* Deterministic, short rounds with clear CC/VFX and repeatable replays.

---

## Monorepo Layout

Scaffolded by `bootstrap-monster-tactics.sh` (see [Bootstrapping](#bootstrapping)).

```
/MonsterTactics
  /apps
    /web           # React + Vite + PixiJS client
    /server        # Local dev server / future Ollama proxy
  /packages
    /sim           # Deterministic combat engine (no rendering)
    /content       # Data packs: units, items, cards, nodes, catalysts, lures
    /ai-npc        # LLM personas, action schema, RAG glue
    /ui            # Shared UI components (deck HUD, gauge, hex widgets)
    /state         # Zustand stores, save/load, migrations
    /tools         # Validators, seeders, replay tester CLI
  /tests           # Sim snapshots, persona convo snapshots
  /docs            # Design notes, architecture
  /scripts         # Utility scripts (bootstrap, etc.)
```

---

## Prerequisites

* Node.js 18+ (use `corepack` or `.nvmrc`)
* pnpm, yarn, or npm (examples use **pnpm**)
* Optional: GitHub CLI (`gh`) if creating a remote repo

**Recommended versions**

```
node 18+
pnpm 9+
```

---

## Bootstrapping

Use the provided script to scaffold a clean monorepo.

```bash
chmod +x ./bootstrap-monster-tactics.sh
./bootstrap-monster-tactics.sh -n MonsterTactics --public --pm pnpm --no-install
```

**Flags**

* `-n, --name <repo>`   repository directory/name
* `-o, --org <org>`     GitHub org/user for remote creation
* `--public|--private`  repo visibility
* `--pm <pnpm|yarn|npm>` package manager
* `--no-gh`             do not create a GitHub repo
* `--no-install`        skip installing dependencies

---

## Install & Run

Clone and install workspace dependencies:

```bash
git clone <repo-url>
cd MonsterTactics
pnpm install
```

Start the web client (from repo root):

```bash
pnpm -C apps/web run dev
```

Build and preview the production bundle:

```bash
pnpm -C apps/web run build
pnpm -C apps/web run preview
```

**Root scripts** (available via `pnpm run <script>`):

* `dev` – runs `apps/web` dev server
* `build` – builds `apps/web` and then all workspaces where `build` exists
* `lint` – ESLint
* `test` – Vitest
* `typecheck` – TypeScript build mode
* `format` – Prettier write

---

## Workspace Commands

Each workspace can be driven directly with `-C` or via filters:

```bash
# Web app
pnpm -C apps/web dev
pnpm -C apps/web build
pnpm -C apps/web preview

# Sim package build
pnpm -C packages/sim build

# Tools CLI example
pnpm -C packages/tools exec mt-validate
```

**Importing internal packages** (example):

```ts
// apps/web/src/sim.ts
import { helloSim } from "@monstertactics/sim"
console.log(helloSim())
```

**PixiJS & Zustand** are wired in `apps/web` to render the board and manage UI/game state. Add shared UI primitives under `packages/ui`.

---

## Game Design Snapshot

This section distills the active design so engineers and designers share a single source of truth.

### Arena — Hex Board

* Axial coords `(q, r)`; 7 columns wide; 6–7 rows (rhombus).
* Deterministic **tick** loop \~8–10 Hz: energy regen → abilities → move/attack → on‑tick effects.
* Movement: 6‑neighbor adjacency; distance = axial Manhattan `|dq| + |dr|`.
* Targeting priority: nearest by path → frontline bias → lowest HP (stable sort).
* Terrain: Grass, Water, Rock, Storm; AoEs use axial geometry (cones, rings, chains).

### Player Agency — Aether Gauge + Spell Deck

* **Aether** regenerates passively (\~1/sec), cap 10.
* 8‑card **deck**, 4‑card **hand**. Cast → card goes to bottom → draw a new card.
* One **hold** slot per round. Card types: Attack, Support, Terrain, Summon Echo.
* Progression: unlock via shrines/quests; upgrade at Workshop using resources.

### Creatures — Level vs Merge vs Evolution

* **Level (L):** combat XP or items; raises stats only.
* **Merge (★):** spend **Essence Shards** (from duplicates/dismantle) to simulate “three copies → ★”; grants about +25% stats.
* **Evolution (E):** requires **eligibility** (Level threshold *or* ★★) and a **trigger** (biome/time + **Catalyst**, or **Facility** crafting). Branching at ★★ for role‑spec (Vanguard/Striker/Arcanist).

### Synergies & Roles

* Type sets at 2/4/6 (e.g., Fire, Water, Grass, Electric, Rock, Normal) and cross‑role links (e.g., Vanguard+Support, Arcanist trio).

### Economy & Draft

* Rewards: Coins, Essence Shards, catalysts.
* **Capture‑first** acquisition plus a **Stable Draft** between fights (spend Supply Points to pull owned creatures onto the bench). Interest: +1 coin per 10 banked (cap +5).

### Formats & Pacing

* Open‑world fights: single 30–45s round.
* Boss routes: 2–4 escalating rounds with short prep breaks; limited Aether carryover.

### Overworld — Azure Archipelago

* Biomes (Rainforest, Volcanic Ridge, Coral Reef, Ancient Ruins, Misty Highlands, micro‑islets).
* Systems: day/night, weather cells, **binary tides** (MVP), traversal unlocks (ferry → reef‑wade → glider), fog of war, vistas/lighthouses for map intel.

---

## Content Packs

Data‑driven content lives in `packages/content` and is hot‑reload friendly.

```
packages/content/
  units/*.json       # stats, roles, ults, evo reqs
  items/*.json       # equipment, combiners
  cards/*.json       # spells (cost, cooldown, geometry)
  synergies/*.json   # set bonuses
  nodes/*.json       # biomes, encounters, shops, shrines
  catalysts/*.json   # evo catalysts and conditions
  lures/*.json       # spawn biases for captures
  src/index.ts       # export surface for pack loaders
```

**Example unit** (`units/emberon.json`):

```json
{ "id": "emberon", "type": "Fire", "role": "Striker",
  "base": { "hp": 100, "atk": 20, "def": 8, "spd": 12 },
  "ult": "flame_dash" }
```

Add schema validators and a replay tester under `packages/tools`.

---

## AI NPC Layer

NPCs (e.g., Lighthouse Keeper, Traveling Merchant) are defined as personas with a constrained **action schema** to guard rail outputs when using local models via Ollama.

```
packages/ai-npc/
  personas/*.yml         # personas with tone and allowed actions
  schemas/actions.schema.json  # JSON schema for actions
  src/index.ts
```

Example persona snippet:

```yaml
name: "Lighthouse Keeper"
persona: |
  Taciturn but kind; keeps vigil over tides and storms. Offers contracts.
allowed_actions: [offer_contract, reveal_node]
```

---

## Architecture

* **apps/web** – React + TypeScript + PixiJS for rendering; Zustand for state.
* **packages/sim** – engine (deterministic, render‑agnostic) for movement, targeting, statuses, terrain.
* **packages/content** – data packs; validated by tools.
* **packages/ai-npc** – personas and action schemas; optional Ollama proxy via **apps/server**.
* **packages/ui** – shared components.
* **packages/state** – stores, save/load, migrations.
* **packages/tools** – validators, seeders, replay harness.
* **tests** – snapshot tests for sim and personas.

See `docs/ARCHITECTURE.md` for a concise diagram and notes.

---

## Testing & CI

* **Vitest** for unit tests; configure under each package.
* **GitHub Actions** workflow: checkout → setup Node 18 → cache pnpm → typecheck → lint → build `apps/web`.

Run tests locally:

```bash
pnpm test
```

---

## Roadmap & MVP

**MVP (vertical slice)**

1. Hex arena with axial coords, movement, targeting, statuses, terrain.
2. Open‑world single fights + one boss route (2 rounds, escalating mods).
3. 10 creatures, 10 items, 6 cards, 3 catalysts, 3 lures.
4. Synergies at 2/4 tiers; ★ merges via shards; **Evolution via (Level or ★★) + Catalyst/Facility**.
5. Capture‑First + Stable Draft (Supply starts 3; +1 after two clears).
6. Haven upgrades (2 visible) that alter the world graph.
7. NPCs: Lighthouse Keeper and Traveling Merchant with action gating.

**Sprint 0 (spec + stubs)**

* Lock hex math, card loop, and content stubs; node graph for Haven + Reef Coast; persona YAMLs; action schema.

**Sprint 1 (playable)**

* Sim core + Aether/card loop; capture + draft; boss route; Haven upgrades; fixed‑seed replays.

---

## Troubleshooting

* **pnpm workspace warning**: If you see `"The \"workspaces\" field in package.json is not supported by pnpm"`, add a `pnpm-workspace.yaml` at the repo root:

  ```yaml
  packages:
    - "apps/*"
    - "packages/*"
  ```

* **Vite not found**: Ensure `apps/web` devDeps installed. Run `pnpm install` at the repo root (or `corepack enable` first).

* **React Fast Refresh warning**: Ensure components use consistent export styles (prefer default exports for components) and avoid exporting raw booleans from component modules.

* **Node version**: Use Node 18+ (`.nvmrc` is set). If you have multiple Node versions, run `nvm use`.

---

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit using clear messages: `git commit -m "feat(sim): add hex range finder"`
3. Run `pnpm typecheck`, `pnpm test`, and `pnpm -C apps/web build` before PRs.
4. Open a pull request against `main`.

---

## License

MIT License. See `LICENSE` in the repo root.
