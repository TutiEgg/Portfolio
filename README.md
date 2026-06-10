# Portfolio Timeline Site

Single-page Portfolio-Webseite mit animierter, scroll-responsiver Projekt-Timeline, fixem Jahres-Index und Detail-Modal. Gebaut mit **React 18**, **Vite** und **Framer Motion**, auf Deployment via **GitHub Pages** ausgelegt.

## Features

- Hero-Bereich mit Profilbild, Bio, Kontakt und Social-Links (animierte Entrance).
- Alternierende Timeline mit Scroll-getriggerten Aufklapp-Animationen, Hover-Effekten und einem weich eingeblendeten Hintergrund-Akzent pro Projekt.
- Fixierter Jahres-Index am rechten Rand, der das aktive Jahr via `IntersectionObserver` hervorhebt und per Klick zum ersten Projekt des Jahres scrollt.
- Vollständiges Detail-Modal mit Backdrop-Blur, ESC-/Backdrop-Close und Body-Scroll-Lock.
- JSON-gesteuerte Inhalte (`src/data/profile.json` + `src/data/projects.json`), Bilder in `public/images/`.
- Responsives Layout (Desktop alternierend, Mobile einspaltig).
- Smoke-Tests mit Vitest + React Testing Library.
- GitHub-Actions-Workflow, der die Seite bei jedem Push auf `main` automatisch auf GitHub Pages deployt.

## Schnellstart

```bash
npm install
npm run dev       # Dev-Server auf http://localhost:5173
npm run build     # Produktionsbuild in dist/
npm run preview   # dist/ lokal serven
npm test          # Vitest einmal ausführen
npm run test:watch
```

## Projektstruktur

```
src/
├── components/
│   ├── Hero/                 Hero-Sektion
│   ├── Timeline/             Timeline + TimelineItem + YearIndex
│   ├── ProjectModal/         Popup für Projekt-Details
│   ├── Footer/               Footer mit Back-to-Top
│   └── icons/                Inline-SVG-Icons
├── data/
│   ├── profile.json          Name, Bio, Kontakt, Socials
│   └── projects.json         Alle Timeline-Einträge
├── hooks/useLockBodyScroll.js
├── utils/formatMonth.js
├── App.jsx
├── main.jsx
└── index.css                 Design-Tokens + globaler Reset
public/
├── favicon.svg
└── images/                   Profil- und Projektbilder
tests/                        Vitest Smoke-Tests
.github/workflows/deploy.yml  GitHub-Pages-Workflow
```

## Inhalte pflegen

Alle Inhalte sind rein datengetrieben – du musst keinen JSX-Code anfassen.

### Profil anpassen

Öffne `src/data/profile.json` und passe die Felder an. Das Profilbild liegt unter `public/images/profile.svg` (ersetzbar durch eigenes JPG/PNG, dann Pfad in `photo` anpassen).

```json
{
  "name": "Dein Name",
  "role": "Deine Rolle",
  "tagline": "Ein-Satz-Tagline.",
  "bio": "Längerer Bio-Text …",
  "photo": "/images/profile.jpg",
  "email": "you@example.com",
  "location": "Stadt, Land",
  "socials": [
    { "label": "GitHub", "url": "https://github.com/user", "icon": "github" },
    { "label": "LinkedIn", "url": "https://linkedin.com/in/user", "icon": "linkedin" },
    { "label": "Email", "url": "mailto:you@example.com", "icon": "mail" }
  ]
}
```

Verfügbare `icon`-Werte: `github`, `linkedin`, `mail`, `twitter` (in `src/components/icons/SocialIcon.jsx`).

### Projekte hinzufügen / ändern

Editiere `src/data/projects.json`. Jeder Eintrag:

```json
{
  "id": "projekt-slug",
  "title": "Projekt-Titel",
  "month": "2024-03",            // YYYY-MM, steuert Sortierung & Jahres-Index
  "exactDate": "15. März 2024",  // Frei formatierbarer Anzeige-String
  "location": "Berlin, DE",
  "image": "/images/project.jpg",// beliebiges Bild unter public/images/
  "shortDescription": "Kurz-Text fürs Aufklappen.",
  "fullDescription": "Langer Text fürs Modal. Absätze werden durch \n\n getrennt.",
  "tags": ["Python", "MLOps"],
  "links": [
    { "label": "GitHub", "url": "https://github.com/..." }
  ]
}
```

Die Timeline rendert die Projekte in der Reihenfolge, in der sie im Array stehen – neue Einträge kannst du einfach oben einfügen.

### Bilder austauschen

Beliebige JPG/PNG/SVG-Dateien unter `public/images/` ablegen und in der JSON via `/images/<dateiname>` referenzieren. Vite serviert alles unterhalb von `public/` ohne weitere Konfiguration.

## Deployment auf GitHub Pages

1. Repository auf GitHub anlegen (z. B. `portfolio`).
2. Code pushen:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```

3. In den Repo-Settings unter **Pages** die Quelle auf **GitHub Actions** umstellen.
4. Der Workflow (`.github/workflows/deploy.yml`) übernimmt den Rest: Install → Tests → Build → Deploy.
   Die `base`-URL in der Vite-Config wird automatisch aus dem Repo-Namen abgeleitet (`VITE_REPO_NAME`), sodass Asset-Pfade unter `https://<user>.github.io/<repo>/` stimmen.
5. Nach dem ersten erfolgreichen Run findest du die URL in den GitHub-Actions-Logs unter dem `deploy`-Job.

### Lokaler Build mit GH-Pages-Base

```bash
VITE_REPO_NAME=portfolio npm run build
npm run preview
```

### User-/Organization-Site (z. B. `<user>.github.io`)

Wenn die Seite unter dem Domain-Root liegt, die `base` auf `/` belassen: Entweder `VITE_REPO_NAME` leer setzen oder `vite.config.js` anpassen (Block mit `base:`).

## Tech-Stack

| Bereich      | Technologie                                 |
| ------------ | ------------------------------------------- |
| UI-Framework | React 18, Vite 5                            |
| Animation    | Framer Motion 11                            |
| Styling      | CSS Modules + CSS Custom Properties         |
| Tests        | Vitest 2, @testing-library/react, jsdom     |
| CI/CD        | GitHub Actions + actions/deploy-pages       |

## Tests

Die Smoke-Tests decken die wichtigsten Interaktionen ab:

- `Hero` rendert Profilfelder und triggert den Scroll-CTA.
- `TimelineItem` zeigt Datum/Monat, öffnet das Modal und registriert den DOM-Ref.
- `YearIndex` rendert ein Element pro Jahr, markiert aktives Jahr und propagiert Klicks.
- `ProjectModal` rendert Titel/Text, schließt per ESC, Backdrop-Click und Close-Button.

```bash
npm test
```

## Lizenz

MIT – füge bei Bedarf eine `LICENSE`-Datei hinzu.
