# PKD Planning Skills

A single-page website that teaches the PKD Planning System — 33 Claude Code slash commands named after Philip K. Dick characters that externalize engineering thinking steps.

## Live Site

**https://t3dy.github.io/pkd-planning-site/**

## What This Is

The PKD skill system is a set of slash commands for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) that prevent the six most common failure modes in AI-assisted development: scope explosion, token waste, premature coding, LLM overuse, agent chaos, and complexity creep.

Each skill is named after a character from Philip K. Dick's science fiction novels — because Dick's characters are always asking the right question: *is this real, or am I building on assumptions?*

## Features

- **33 skill cards** with expandable details, character backstories, and novel connections
- **Interactive quiz** — "Which Skill Do I Need?" diagnostic
- **Mini-game** — "Name That Failure" scenario trainer
- **9-stage workflow** with complexity slider (simple / medium / full)
- **6 failure mode cards** with antidote skill mappings
- **Trigger phrase reference** — "When you think X, run Y"
- **CLAUDE.md embed** — copy-paste system prompt for planning discipline

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4.2.1
- Lucide React icons
- Hand-drawn aesthetic (Caveat font, wobbly borders, monochrome + accent blue)
- GitHub Pages via GitHub Actions

## Development

```bash
npm install --legacy-peer-deps
npm run dev
```

## Build

```bash
npm run build
```

## License

MIT
