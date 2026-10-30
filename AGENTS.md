# AGENTS.md — Aku Oregairu

## 1. Project identity

**Project:** Aku Oregairu  
**Type:** Independent, noncommercial, Indonesian-language fan translation project dedicated exclusively to *Yahari Ore no Seishun Love Comedy wa Machigatteiru* (Oregairu).  
**Primary goal:** Deliver an exceptionally comfortable, book-like reading experience on mobile phones.  
**Deployment:** GitHub Pages, as a fully static site.

This file is the standing product and engineering brief for AI coding agents (including Codex). Read it before proposing architecture, generating code, or changing UI. Preserve the decisions here unless the project owner explicitly changes them.

### Core principles

1. **Only Oregairu.** This is not a multi-title novel platform, e-commerce storefront, generic library, or manga reader.
2. **Reading first.** The interface should disappear while reading.
3. **Mobile first.** Design and test on narrow phone viewports before desktop.
4. **Kindle-inspired restraint.** Prioritize readable typography, whitespace, subtle hierarchy, calm surfaces, and useful interactions. Do not clone Kindle branding or interface assets.
5. **Static and fast.** No backend or database is needed for the initial release.
6. **No invented content.** Do not fabricate official volume metadata, chapter names, counts, release dates, covers, or translation status.
7. **Copyright-aware.** Do not scrape, bundle, reproduce, or publish copyrighted novel text, translations, or illustrations without the appropriate rights/permission. Use original placeholder text and licensed/authorized images during development. A noncommercial fan disclaimer is not permission.

## 2. Locked product decisions

- Language: **Bahasa Indonesia** for the user-facing interface.
- Scope: **Oregairu only**; one series, multiple volumes and chapters.
- Homepage: **the volume catalog itself**. A Yukinon background hero matching the supplied reference is explicitly approved by the owner; keep the catalog directly below it on the same page. No separate landing page, splash screen, or introduction gate.
- Reading model: **Page Flip** / paginated horizontal reading, not default continuous scrolling.
- Visual direction: minimalist, premium, literary, e-reader-like; not an anime merchandise shop.
- Reader: responsive book-style pages, adjustable typography and theme, automatic local progress saving.
- Illustrations: fit entirely in the available viewport by default; tap to open a full-screen zoomable viewer; support wide/double-spread images.
- Hosting: GitHub Pages.
- User accounts, cloud sync, comments, donations, ads, dashboards, and server-side APIs: **out of scope** unless explicitly requested.

## 3. Information architecture

### `/` — Homepage / Volume Catalog

This page must show Oregairu volumes immediately below a compact site header. Make the volume collection the dominant content.

- Compact wordmark: `Aku Oregairu` (or `aku.oregairu` as a typographic treatment).
- Optional understated subtitle: `Indonesian Fan Translation`.
- Display real, verified volume records in their intended sequence.
- Show cover (only if authorized), volume number, and minimal status information when available.
- Allow a reader to select a volume directly.
- Offer a discreet **Lanjutkan Membaca** entry when valid local reading progress exists; it must not displace the catalog.
- Keep mobile layout practical: a clean 2-column grid is an acceptable baseline, but the design can explore a more distinctive volume-selection interaction if it remains simpler and more useful than a conventional store grid.
- Desktop should scale gracefully without oversized cards or excessive empty decoration.
- No fake statistics, fabricated chapter counts, ornamental bookshelves, oversized promotional banners, auto-playing carousels, or generic promotional copy.

### `/volume/[slug]/` — Volume Detail

- Volume cover or a designed placeholder, number, and verified metadata.
- Clear primary action: `Mulai Membaca` or `Lanjutkan Membaca` if progress exists.
- Chapter list in narrative order, with accessible tap targets.
- Optional sections for synopsis, illustration index, and translator/editor notes, only if content exists.
- Minimal navigation back to the catalog.
- Do not invent chapter titles or metadata to make the page look complete.

### `/baca/[volume]/[chapter]/` — Reader

- Full-viewport, distraction-free reading experience.
- Page-based navigation with horizontal tap/swipe and keyboard support.
- Minimal controls; top/bottom bars can hide while reading and reappear on center tap.
- Show chapter identity and current page/progress unobtrusively.
- Provide a clear exit, table of contents, reading settings, and bookmark/progress affordance.
- Reading state must survive refreshes and ordinary return visits on the same browser.
- If JavaScript fails, provide a readable fallback where feasible; never trap the reader on a blank screen.

### `/tentang/` — About

Briefly describe the independent fan project, editorial process, AI assistance disclosure when applicable, attribution, and rights/contact information. Avoid implying official affiliation or licensing.

## 4. Design system

### Visual tone

Think **quiet e-reader / literary editorial**, not colorful anime portal.

Suggested initial tokens (refine through real device testing):

```css
:root {
  --paper: #ffffff;
  --paper-elevated: #fafafa;
  --ink: #202020;
  --ink-muted: #696969;
  --line: #e5e5e5;
  --accent: #242424;
  --content-max: 1120px;
  --reader-max: 680px;
}
```

- Default reading prose uses locally hosted Noto Sans; offer Literata as a Serif setting. Use regular/italic/bold variants to preserve source emphasis.
- All site, page, volume, chapter, dialog, and hero titles use locally hosted Nunito weight 900, rounded like the volume-cover lettering. The wordmark and main hero title are uppercase; other headings retain their natural case. Reading prose defaults to Noto Sans, with Literata available as a reader setting.
- Default site surfaces and the initial reader theme are white. Retain Kertas and Gelap as explicit reader palettes and preserve existing saved preferences.
- The Yukinon hero is 300–340px tall on phones and at most 360px on desktop; blend artwork into white using a subtle CSS fade, keep the face visible, and place the catalog heading/grid directly afterward.
- Host fonts locally where licensing allows; minimize font weights and payload.
- Comfortable reading line-height, typically around 1.65–1.9; user-adjustable.
- Avoid fully justified Indonesian prose if it causes distracting word gaps on narrow screens; default to left-aligned text unless testing supports otherwise.
- Use consistent spacing, understated separators, soft surfaces, and high contrast.
- Avoid heavy gradients, glassmorphism, neon accents, dense card borders, giant shadows, and ornamental animations.
- Respect `prefers-reduced-motion` and accessible contrast.

### Responsive expectations

Test at approximately 320px, 360px, 390px, 430px, 768px, and desktop widths. Respect safe areas, dynamic mobile browser chrome, and landscape orientation. No horizontal overflow on catalog/detail pages.

## 5. Page Flip reader requirements

This is the most important engineering feature. Implement a **reliable paginated reader**, not an expensive 3D page-turn gimmick.

### Navigation

- Tap right region: next page; tap left region: previous page.
- Swipe horizontally to turn pages; distinguish deliberate horizontal gestures from vertical touch movement.
- Keyboard: ArrowRight/ArrowLeft for page navigation; Escape for dismissing overlays where appropriate.
- Center tap: toggle reader controls, without interfering with links or selection.
- Provide visible, accessible alternatives to gestures.
- Avoid accidental turns when selecting text, zooming an illustration, or using settings.
- Use a subtle, short page transition; disable/reduce animation for reduced-motion preferences.

### Pagination

- Paginate according to **actual rendered layout**, not hardcoded character counts or assumed pages per chapter.
- Preserve paragraphs, headings, and inline emphasis; avoid splitting images and important blocks awkwardly.
- Recalculate on viewport/orientation changes, font load, font-size/line-height changes, and illustration load.
- Preserve the reader's logical position using a stable content anchor (paragraph/block ID plus offset or equivalent), not only a page number that can change with reflow.
- Avoid flashes of unpaginated text and race conditions during recalculation.
- If a chapter is too complex for the chosen pagination approach, prefer a readable, documented fallback over broken pages.
- Page count is dynamic; do not treat it as fixed editorial metadata.

### Illustration handling

- Treat illustrations as first-class reading blocks in their intended narrative order.
- Never crop an illustration merely to fill a page; default to `object-fit: contain`.
- If an illustration cannot fit comfortably with prose, assign it a dedicated page.
- Tap to open an immersive viewer with zoom/pan and a clear close action.
- Handle landscape and double-page spreads gracefully.
- Include meaningful alternative text or an appropriate decorative designation.
- Lazy-load noncritical images without breaking pagination or reader progress.

### Settings and persistence

- Theme: `Kertas`, `Putih`, `Gelap`.
- Adjustable font size, Sans-serif/Serif font choice, and line spacing. Default: Sans-serif (Noto Sans), 18px, line spacing 1.8, Putih. Preserve older theme/size/spacing settings during migration.
- Persist settings and reading progress using `localStorage` with a versioned schema and defensive parsing.
- Track volume/chapter and stable content anchor, with a safe fallback if content changes.
- Do not require registration or external analytics.

## 6. Recommended implementation

**Default stack:** Astro + TypeScript + CSS, with small client-side interactive islands/components only where needed. Use framework-agnostic TypeScript or a lightweight UI island for the reader. Avoid introducing React or a large page-flip library without a clear technical reason and bundle-size assessment.

- Astro static output: `output: 'static'`.
- Store authorized editorial content as typed collections (Markdown/MDX or structured data).
- Separate catalog metadata, chapter content, illustration references, and reader logic.
- Prefer simple CSS and semantic HTML over a large UI component library.
- Do not add Prisma, PostgreSQL, authentication, server endpoints, or a CMS by default.
- Use route-safe links and assets that work under both a GitHub Pages project subpath and a custom domain.
- Configure Astro `site` and `base` for the actual repository/deployment target; **ask for the repository name or deployment URL if unknown** rather than assuming root hosting.
- Deploy static `dist/` using GitHub Actions / GitHub Pages.
- Do not depend on Node.js at runtime on GitHub Pages.

### Suggested source layout (adapt as needed)

```text
src/
  components/
    SiteHeader.astro
    VolumeCard.astro
    VolumeNavigator.astro
    ReaderShell.astro
    IllustrationViewer.astro
  content/
    volumes/
    chapters/
  layouts/
    BaseLayout.astro
    ReaderLayout.astro
  lib/
    catalog.ts
    reader/
      pagination.ts
      navigation.ts
      progress.ts
      settings.ts
  pages/
    index.astro
    tentang.astro
    volume/[slug].astro
    baca/[volume]/[chapter].astro
  styles/
    tokens.css
    global.css
public/
  assets/
    placeholders/
.github/workflows/
  deploy.yml
```

This structure is guidance, not a mandate to create empty files or unnecessary abstractions.

## 7. Content, translation, and rights rules

- All visible interface copy should be natural Indonesian.
- Treat translations as editorial material requiring human review. The owner explicitly requested public Volume 1 Bab 1 as an AI-assisted draft before human review; label it accordingly. Set editorialStatus to reviewed only after the owner confirms that review is complete.
- Keep a glossary/style guide for names, honorifics, tone, and recurring terms when translation work begins.
- Never silently rewrite the meaning of a source passage for fluency.
- Be transparent about AI assistance without making AI the site's visual identity.
- Do not download or reproduce official Oregairu covers, light-novel illustrations, or complete copyrighted chapters from third-party sites as development seed data.
- Use original mock text and generic, licensed placeholders until publication rights are established.
- Clearly distinguish mock content from real editorial content.

## 8. Accessibility, performance, and quality

- Semantic headings, buttons, links, and landmarks; visible focus states.
- Touch targets approximately 44×44 CSS pixels where practical.
- Screen-reader labels for icon-only controls.
- Keyboard-accessible dialogs and image viewer; restore focus on close.
- Avoid layout shift, unnecessary animation, and large JavaScript bundles.
- Optimize images and supply responsive sources when possible.
- Ensure typography remains readable at 200% zoom and with larger system text.
- Test browser back/forward navigation, deep links, refreshes, offline/reload failure states, and invalid localStorage.
- Validate GitHub Pages subpath asset resolution before release.

## 9. Development workflow for Codex

1. Inspect the existing repository and this `AGENTS.md` before editing.
2. State a brief implementation plan for any substantial change.
3. Build incrementally: base layout → homepage/catalog → volume detail → functional reader → pagination robustness → illustration viewer → settings/progress → deployment.
4. Prefer working end-to-end features over elaborate mockups with nonfunctional controls.
5. Do not add a feature merely because it is common on reading platforms.
6. Keep dependencies minimal; explain major new dependencies.
7. After changes, run available type checks, builds, and relevant tests; report what was and was not verified.
8. Never claim the reader works on mobile without testing responsive behavior or explaining the test limitation.
9. Ask before making major changes to the locked product decisions.
10. When generating example content, label it as original placeholder content.

## 10. Definition of done — initial MVP

- [ ] Homepage opens directly to a usable Oregairu volume catalog.
- [ ] Selecting a volume opens its detail page.
- [ ] Chapter navigation opens a functional Page Flip reader with translated editorial content.
- [ ] Reader handles tap, swipe, keyboard, resizing, and font changes without losing logical position.
- [ ] Illustrations display uncropped and can open in a zoomable viewer.
- [ ] Theme, typography, and progress persist locally.
- [ ] Mobile UI is polished and usable on narrow screens.
- [ ] Site builds as static output and works on GitHub Pages, including subpath URLs.
- [ ] No unauthorized copyrighted text or illustrations are included.

## 11. Explicit anti-patterns

**Do not implement:** decorative bookshelves, faux wooden textures, oversized promotional hero banners, multi-series search, storefront pricing, account systems, fake reading statistics, busy dashboards, autoplay effects, excessive page-turn 3D physics, or meaningless placeholder controls.

**North star:** The homepage makes choosing an Oregairu volume effortless. The reader makes the website itself easy to forget.

## 12. Current editorial implementation

- Demo prose and SVGs are retired. Old demo URLs display a short replacement notice linking to Volume 1. Do not restore demonstration content.
- Volume 1 Bab 1 is translated from the owner-provided English EPUB, not directly from Japanese. Include all chapter001* spine sections before Chapter 2 and the four illustrations in order; do not bundle English prose extraction or EPUB files.
- Store chapter metadata/status in `src/content/chapters/index.json`; available statuses are `draft` and `reviewed`. Content uses stable block IDs and source references. Instructions and glossary live in `docs/editorial/`.
- Hero credits: Wataru Watari (Penulis), Ponkan8 (Ilustrator).
- Settings/progress use version 2. Preserve old settings; ignore demo progress. Sans-serif is the default, while serif remains available.
- PWA/installability/offline caching are explicitly deferred by the owner; do not add them in this change.

## 13. Volume opening reading flow

- Volume 1 opens at `/baca/volume-1/pembuka/` when no valid progress exists. Include the eight illustrated front-matter pages in EPUB spine order, plus translated companion text; administrative pages are summarized as attribution. Do not publish links to unavailable chapters.
- Metadata represents front matter as `kind: frontmatter`, `number: null`, `order: 0`; numbered chapters use `kind: chapter` and positive numbers. Never label the opening as Bab 0.
- Previous/next navigation crosses section boundaries. Returning from the first page of Bab 1 opens the final page of Pembuka. Preserve existing version-2 progress for Bab 1; the opening has its own stable section/block IDs.
- Center tap continues to toggle the existing reader controls, including the header. Do not make the header permanently visible.
- Review status applies independently to Pembuka and Bab 1. Only mark a section reviewed after the owner confirms review of that section.
