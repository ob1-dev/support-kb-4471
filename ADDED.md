# What was added to the kb export

Base: the support desk's kb export (`support-kb/`, exported 2026-10-04), unchanged except as listed here.

| Path | What |
|---|---|
| `src/routes/kb/incidents/4471-split/+page.svx` | The new page: #4471 split into problems, signed (`signature` in frontmatter, ends with `<RenderStamp {signature} />`). |
| `src/lib/kb/problems.ts` | Logic for the split, with the desk's own view (`causes.ts` as exported): each report counted once under its cause by tenant; desk-notes one-day moves are their own problem, footnoted under the cause they are filed in. |
| `src/lib/kb/ProblemTable.svelte` | Table on the page; every count is computed from `reports-4471.json` at render time. |
| `rendered/kb-incidents-4471-split.png`, `rendered/kb-incidents-4471-split.html` | The page as the desk sees it (built 2026-10-28, full-page screenshot in a 1280 px wide browser). |
| `build/` | The whole kb, prerendered (static). Serve `build/` and open `/kb/incidents/4471-split/`. |
| `package.json`, `vite.config.js`, `src/app.html`, `src/routes/+layout.ts` | Build setup (the export ships `src/` only): SvelteKit 3 + mdsvex, static adapter, `#lib` → `src/lib`. |

Tickets, one per problem: [#1 parser](https://github.com/ob1-dev/support-kb-4471/issues/1) · [#2 hint](https://github.com/ob1-dev/support-kb-4471/issues/2) · [#3 one-day move](https://github.com/ob1-dev/support-kb-4471/issues/3).

Build: `npm ci && npx vite build`.
