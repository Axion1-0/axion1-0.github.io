# Axion 1.0 — Project Page

**Open Agent Foundation Models, Simplified**

This repository contains the Axion 1.0 research homepage and paper figures.

**[View the project homepage](https://axion-1-research.youngrain34.chatgpt.site)**

## Contents

- `index.html` — homepage content and resource buttons.
- `style.css` — desktop and mobile layouts.
- `app.js` — linked benchmark comparisons, training-stage curves, and interactive recipe.
- `assets/` — homepage logo and paper figures.
- `figures/` — original figures already in this repository.
- `paper/` — location for the manuscript PDF.

## Local preview

No build step or package installation is required. From this directory, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Paper and dataset links

The Paper and Hugging Face Dataset entries are marked **Coming soon** until their final files or URLs are available.

To host a PDF in this repository, add it as `paper/axion.pdf`. The homepage's Paper entry can then link to that file, or to its GitHub URL. Once arXiv is available, replace the Paper URL with the arXiv link.

The existing live homepage stays at the URL above. This repository stores the portable website source; a GitHub push does not automatically update the Sites-hosted page.

## Paper figures

![](figures/figure1.png)

![](figures/figure2.png)

![](figures/table1.png)
