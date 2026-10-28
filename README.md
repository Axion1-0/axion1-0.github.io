# Axion 1.0 — Project Page

**Open Agent Foundation Models, Simplified**

This repository contains the Axion 1.0 research homepage and paper figures.

**[View the project homepage](https://axion1-0.github.io/)**

## Contents

- `index.html` — homepage content and resource buttons.
- `style.css` — desktop and mobile layouts.
- `app.js` — linked benchmark comparisons, training-stage curves, and interactive recipe.
- `assets/` — homepage logo and paper figures.
- `figures/` — figures and the overall-results table from the current manuscript.
- `paper/` — location for the manuscript PDF.

## Local preview

No build step or package installation is required. From this directory, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Paper and dataset links

The Paper button links to [the manuscript PDF](https://axion1-0.github.io/paper/axion.pdf). The Hugging Face Dataset entry remains **Coming soon**.

The manuscript is hosted at `paper/axion.pdf`. Once arXiv is available, the Paper button can point to its arXiv page.

GitHub Pages publishes the `main` branch at the homepage URL above.

## Paper figures

### Figure 1 · Benchmark comparison

![Axion 1.0 benchmark comparison](figures/figure1.png)

### Figure 2 · Data construction pipeline

![Two-stage data construction pipeline](figures/figure2.png)

### Table 1 · Overall performance

![Overall performance from the current manuscript](figures/table1.png)
