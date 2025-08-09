# MonsterTactics Architecture (draft)
- Web client (React + Pixi)
- Deterministic sim in packages/sim
- Content packs in packages/content
- LLM NPC layer in packages/ai-npc (via Ollama)
- CI: build, typecheck, lint; extend with tests & e2e later
