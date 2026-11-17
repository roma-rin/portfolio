# <img src="img/apple-touch-icon.png" alt="" width="52" align="absmiddle"> Portfolio

**https://portfolio.romarin.tech/**

This repository hosts the source code of my personal portfolio website: a single-page site designed and built in plain HTML, CSS and JavaScript. It covers my background, projects, news, and contact info.

## Design & build process
The visual design and design system (colour palette, typography, card/section layout) were created with Claude Design, then implemented into this repository with Claude Code.

## Structure
```
portfolio/
├── index.html              # the page content
├── design-system.html      # living style guide: colours, type, spacing, components, rules
├── css/
│   └── style.css           # all styles, with the colour, type and spacing tokens at the top
├── js/
│   └── main.js             # mobile menu, scroll spy, Background slider, News accordion,
│                           # Paris clock, copy e-mail, analytics events
├── font/                   # Sonder (display) and Hanken Grotesk (body)
├── img/
│   ├── news/               # photos, posters and slides of the News entries
│   └── ...                 # portrait, logo, favicons, link preview banner
├── resume/                 # the resume linked from the Contact section
├── Dockerfile              # nginx image serving the site
├── .github/workflows/
│   └── build.yml           # builds and publishes the image on each push to main
└── CLAUDE.md               # project notes
```

## Deployment
Each push to `main` builds a Docker image and publishes it to `ghcr.io/roma-rin/portfolio`, tagged `latest` and with the commit sha. Then, the server hosting the site runs that image.

## Analytics
The site uses [PostHog](https://posthog.com/) to count page views and a few interactions, such as which sections are read and which links are opened.

## Credits
Fonts: [Sonder](https://www.behance.net/gallery/122049337/Sonder-Beautiful-Serif-Typeface) by VP Creative Shop, [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) by Hanken Design Co.