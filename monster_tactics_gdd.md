# MonsterTactics — GDD Start (Core Concept Synthesis)

> **Scope:** Consolidated from your idea lists; grouped for readability. Core values preserved without adding or altering mechanics.

---

## 0) Quick Idea Inbox (paste here)

- Drop raw notes anytime; I’ll sort and integrate into the right sections.
- Optional inline tags to help routing: [World], [Story], [Ship], [Combat], [Monsters], [Spells], [Exploration], [Economy], [UI], [Tech], [Art], [LLM], [OpenQ], [Prototype].
- Use short bullets or mini‑paragraphs. No formatting rules required.

### Paste Template (optional)

```
[Tag(s)]: <raw thought goes here>
```

---

## 1) Premise & Core Fantasy

- There is **no fixed starting location**; the **portable, customizable ship** serves as the initial **starting hub/place‑holder**.
- The origin is intentionally open‑ended on a **distant planet** (colony world), avoiding a crash‑landing/mandatory repair trope.
- Colonies are threatened by **alien life**, **raiders**, **bounty hunters**, **smugglers**, and other factions.
- Ultimate goal: defeat the **factions** and a **primary antagonist** with a **monster-linked power** similar to the protagonist, attempting to **harness a specific planetary resource**.

---

## 2) World & Tone

- **Distant planet colony** setting with a **delicate balance of cozy and gritty**: DS2-style ominous threats alongside Stardew/Pokémon warmth.
- The world is **war‑torn/post‑apocalyptic** in places; factions and monsters have ravaged towns/cities.
- **Elden Ring** sense of exploration and grandeur.
- A **unique planetary resource** (unnamed; analogous to chiral crystals/tar) permeates ecosystems and monster biology.

---

## 3) Player Role & Identity

- Protagonist is part of a **special division** that uses monsters to fight both monsters and the enemy faction.
- The **player character has powers** that encourage **active gameplay during auto‑battles**, and these powers **upgrade over time**.
- **Use model:** powers run on **charges + cooldowns**; balance guardrails to be tuned during playtests.
- The player's powers are **related to the monsters**.
- **Extensive customization** for player appearance and build.

---

## 4) Homebase: Portable Customizable Ship (DHV Magellan‑inspired)

- A **portable, customizable ship** modeled more directly after the **DHV Magellan** from DS2 serves as the player’s homebase.
- The ship is **mobile** and can **node‑hop** between specific points on the world map for **quick travel**.
- Design vision: industrial, modular, and utilitarian rather than sleek; evokes a heavy cargo/utility craft with visible thrusters, articulated arms, and robust landing gear.
- Functions like the **Stardew farm** while retaining a sci‑fi military transport vibe.
- Supports **farming**, **crafting**, **enhancing monsters**, and **workbench** upgrades (including **weapons**).
- **Progression gates:** power grid, cargo capacity, crew/station slots, research tiers.
- **Visual** and **stat** upgrades to the base/ship are a core loop.

---

## 5) Creatures / Monsters

- You **capture, evolve, and maintain** creatures.
- **Acquisition:** starter creature at the outset; expand the party via **capture**, **quests**, **crafted bait/contracts**, **overworld encounters**, and **recruitment**.
- They may **produce resources** with special properties (e.g., for **healthcare**, **technology**, or **ethereal** uses) tied to the **planetary resource**.
- **Post‑battle outcomes:** defeated creatures can be **harvested/absorbed/collected** for materials or essences that **feed merging/evolutions**.
- Monsters form your **battle party** for auto‑battler encounters.

---

## 6) Combat: Auto‑Battler with Active Player Powers

- Battles are **autochess / autobattler / TFT‑style** with a **player spellcasting layer**.
- The **player** participates via **active spells** that **buff, heal, damage, and disrupt**—replacing any in‑battle shop.
- **Synergies** and **types** are present but **kept restrained** (not overdone).
- **Basic attacks** build meter toward **special attacks** (for units).
- **Environment and weather** influence **spawn systems**.
- **Post‑battle harvesting** yields essences/materials used for **merging/evolution/crafting**.
- **Gun gameplay** is **interesting but undecided**.
- **Evolutions/stars/tiers** exist but are **TBD**; likely tied to **leveling**, **collection**, and **merge/essence systems**.

### 6.1 Player Spellcasting — Elixir Economy (Shop Replacement)

- **Resource:** "**Elixir**" (name TBD; thematically tied to the planetary resource). Generated passively during battles and spent to cast spells.
- **Regen & Cap (tunable defaults):**
  - **Cap:** 10 Elixir; **Starting Elixir:** 3.
  - **Regen:** \~**1 Elixir/sec** (at 20 ticks/sec → +0.05 per tick). Regen rate may be modified by ship modules, discoveries, or buffs/debuffs.
- **Costs & Cooldowns:**
  - **Costs:** 2–8 Elixir (minor → ultimate).
  - **Cooldowns:** 6–20s; **global cast‑lock:** 0.5s to prevent spam.
- **Loadout & Unlocks:**
  - Player equips **4 spells** into a **hotbar** from an owned pool; spells are **unlocked via XP/skill points** and **world discoveries**.
  - Spells are **linked to monsters** in the party (bonded or slotted) and scale with relevant **synergy tags**.
- **Targeting Types:**
  - **Unit‑target (ally/enemy)**, **tile/area** (circle, cone, line, 3×3), and **global toggles** (short duration auras).
  - **Cast rules:** respect line‑of‑sight/obstacles where applicable; telegraphs and brief cast times on high‑impact effects.
- **Examples (MVP placeholders):**
  - **Overcharge** (Buff): +20% attack speed to allies in 3×3 for 4s. **Cost 3**, **CD 10s**.
  - **Kinetic Lance** (Damage Line): 5‑tile piercing hit. **Cost 4**, **CD 8s**.
  - **Aegis Field** (Shield AoE): 120 shield for allies in a small radius for 5s. **Cost 5**, **CD 12s**.
  - **Stasis Snare** (Disrupt): Root enemies in 2×2 for 2s. **Cost 4**, **CD 15s**.
- **AI Parity:** Enemy characters/factions can **also cast** using the same Elixir rules with tuned difficulty curves (tempo scripts + randomness).
- **Anti‑Snowball/Fairness:** Soft caps on stacking buffs, diminishing returns, and **ultimate throttles** (e.g., max 1 ultimate per 10s).
- **UI/UX:**
  - **Hotbar (4 slots)** mapped to **1‑4/QWER**; **Elixir bar** with numeric value and regen pulse; cast range/area telegraphs with color‑blind‑safe palette.
  - Clear error states: out of Elixir, on cooldown, invalid target.

---

## 7) Exploration & Overworld

- **Top‑down** movement and **tile‑based** navigation inspired by Pokémon.
- A **nodal map** structure connects **biomes/zones**; the **ship can node‑hop** for **fast travel** between unlocked points.
- Each new zone is **challenging** and may include **boss‑type** encounters.
- Exploration pillar: **discover lost secrets** of the world and monsters, **solve puzzles**, and **uncover mysteries** tied to the **planetary resource**.

---

## 8) Progression & Upgrades

- **XP → skill points** for the player; some **unlocks tied to discoveries** in the world.
- **Player powers**, **monsters**, and **weapons** have **meaningful upgrade paths**.
- The **weapon workbench** supports crafting, modification, and enhancement.
- **Guardrails** and balance will be **implemented during gameplay tests**.
- Every mechanic should have a **clear reason to exist**.

---

## 9) NPCs & Interaction

- **NPCs powered by LLMs** for next‑gen interaction and narrative texture. The LLM will be powered by gpt-oss:20b for now but will require further testing and tuning. The goal is to have NPCs that can hold meaningful conversations, provide lore, and offer quests.
- Emphasis on **connection** themes (inspired by Death Stranding) within a damaged world. Helping those people in need. Those that cannot fend for themself. They could join your crew and provide services. Herbalist, mechanic, cook, etc.
- **Factions** with distinct personalities, goals, and relationships to the player.
- **Quests** range from **main story arcs** to **side missions** that deepen worldbuilding and character relationships.
- **Dialogue** is **dynamic and branching**, influenced by player choices and actions. This is quite ambitious and may be scoped down to key NPCs only. Espcially with the implementation of LLMs.

---

## 10) Visual & UI Direction

- **Top‑down Pokémon/Stardew** presentation; **pixel art** is possible, but **clarity** is a priority.
- **Actions and menus** prioritize **clear functionality**.
- Preference for the **existing sprite aesthetic** for the main character.
- Plan to **generate sprite sheets** programmatically with assistance.

---

## 11) Technology & Production

- **Tech stack** is **undecided**: coding everything from the ground up vs. using an **engine**. Key engines that I'm thinking about are **Godot** (open source, lightweight, flexible) or **Unity** (more established, larger community, more built-in features). Unreal is likely overkill for this type of game. I'm also thinking about just using a web-based approach with something like React + PixiJS or Phaser. This is a big decision that will impact production speed and capabilities.
- **LLM integration** for NPCs and dynamic dialogue.
- **Procedural generation** for monsters, items, and possibly environments to enhance replayability. This is a stretch goal and may be scoped down.
- **Modular architecture** to support future expansions and updates.
- **Version control** and **collaborative tools** to streamline workflow.

---

## 12) Open Questions (Deliberately Unresolved)

- **Planetary resource:** name, properties, and how it permeates ecology, monsters, and crafting.
- **Combat adjunct:** Whether and how to include **gunplay**.
- **Evolution model:** Exact rules for **evolutions/stars/tiers** and how they tie into **leveling/collection/merging**.
- **Shopless economy in combat:** Scope of **active powers** as the replacement for **buy/reroll** (reward sources, pacing).
- **Art style:** **Pixel art** vs other approaches, keeping **clarity** paramount.
- **Engine choice:** **Godot** feasibility vs building systems **from scratch**.
- **Economy ties (PINNED):** Specifics of **monster‑produced resources** and their roles in healthcare/tech/ethereal crafting; sinks/sources across ship modules.
- **Boss taxonomy:** How bosses manifest across zones/biomes and tie into the core narrative.

---

## 13) Guiding Principles

- **Positioning and preparation** drive success; moment‑to‑moment action is **low‑APM** but **high‑impact** via player powers.
- **Exploration** and **connection** feed the combat and economy loops.
- Maintain a **cohesive purpose** for every mechanic; avoid feature bloat.
