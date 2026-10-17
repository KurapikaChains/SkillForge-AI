# SkillForge AI

**Build practical AI automation skills by turning your existing knowledge into useful tools.**

SkillForge AI is a beginner-friendly portfolio project combining:
- **Creator Assistant** — draft TikTok affiliate hooks, captions, voiceovers, and 8-scene storyboards.
- **BMS / Maintenance Assistant (planned)** — organize equipment observations into maintenance notes and shift handovers.
- **Automation Lab (planned)** — document and connect practical workflows using forms, spreadsheets, and AI services.

The front end uses HTML, CSS, and JavaScript. Image-based AI generation uses a small Node.js/Express backend and an OpenAI API key stored in a local `.env` file.

## Run it locally

1. Download or clone this repository.
2. Open `index.html` in your browser.
3. Choose **Creator Assistant**, enter a product description, and click **Generate draft**.

Or clone with Git:

```bash
git clone https://github.com/KurapikaChains/SkillForge-AI.git
cd SkillForge-AI
```

Then follow the setup steps above.

## Project structure

```text
SkillForge-AI/
├── index.html       # Application layout
├── styles.css       # Responsive styling
├── app.js           # Draft generation and interactions
├── README.md        # Project documentation
├── ROADMAP.md       # Learning and feature roadmap
└── .gitignore       # Files that should not be committed
```

## Current features

- TikTok hook, caption, voiceover, and storyboard draft generation.
- English and Taglish output styles.
- Copy individual results or copy the full draft.
- Sample product prompt to help first-time users.
- Responsive layout for desktop and mobile.
- Product image upload with preview and file-size/type validation.\n- Vision-capable AI generation through a server endpoint (requires an API key).\n- Template-based mode when no image is selected.

## Learning objectives

1. Understand repository files, commits, and GitHub history.
2. Practice HTML, CSS, and JavaScript by changing one small feature at a time.
3. Learn prompt design and structured outputs.
4. Learn how a secure backend sends image input to a vision-capable AI model.
5. Build a BMS reporting prototype using fictional/demo data only.

## Roadmap

See [ROADMAP.md](ROADMAP.md).

## Safety and privacy

- Do not enter confidential employer information, customer data, credentials, or building-security details.
- Do not use generated maintenance suggestions as authorization to operate or modify equipment. Follow site procedures and qualified-person review.
- Never put API keys in front-end JavaScript or commit `.env` to GitHub. Use `.env.example` only for variable names.\n- Product photos are sent to the configured AI provider when image generation is requested; avoid photos containing private or sensitive information.
- Generated creator copy is a draft. Verify product claims, prices, and platform policies before publishing.

## Portfolio description

> SkillForge AI is a practical learning project that applies beginner web development and AI-automation concepts to two areas I understand: short-form affiliate content and building maintenance operations. I am developing it iteratively, documenting the trade-offs, and learning how to connect front-end tools with responsible automation workflows.

## License

No license has been added yet. Add one when you decide how you want others to use or reuse the code.
