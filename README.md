# <img src="img/apple-touch-icon.png" alt="" width="52" align="absmiddle"> Portfolio

**https://portfolio.romarin.tech/**

This repository hosts the source code of my personal portfolio website: a single-page site designed and built with Claude in plain HTML, CSS and JavaScript. It covers my background, publications & projects, news, and contact info, with a dark theme and a fully responsive layout.

## Design & build process
The visual design and design system (colour palette, typography, card/section layout) were created with Claude Design, then implemented into this repository with Claude Code.

## Structure
- `index.html`: the page content.
- `design-system.html`: a living style guide (colours, type, spacing, components, rules). Loads the real `css/` files, so it always matches the site (not part of the public site's navigation, kept for reference when extending the design).
- `css/style.css`, `css/palettes.css`: all styles and colour tokens.
- `js/main.js`: interactions, mobile menu, scroll spy, Background slider, News accordion, Paris clock, copy e-mail.
- `font/`: Sonder (display font) and Hanken Grotesk (body font, fallback).
- `img/`: portrait, logo, favicons, News photos.
- `cv/`: the CV linked from the Contact section.
- `CLAUDE.md`, `.claude/`: project notes and a Claude Code skill, kept for whoever (human or Claude) picks this project back up.