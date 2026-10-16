# otis.codes

Personal site for Otis Wilcox, served by GitHub Pages at https://otis.codes.

One page (`_layouts/home.html`) with a route per section: `/`, `/work/`, `/projects/`, `/contact/`.
Each route is a small front-matter file that renders the same layout; `assets/site.js` scrolls to the
section and keeps the URL in sync as you scroll.

Preview locally with Jekyll: `bundle exec jekyll serve` (or just push; Pages builds it).
