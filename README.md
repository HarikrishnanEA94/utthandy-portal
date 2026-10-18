# Utthandy: cybersecurity training portal

Source code for [Utthandy](https://harikrishnanea94.github.io/utthandy-portal/), a free, hands-on cybersecurity training site. It focuses mainly on IT security and also covers OT/ICS. The site is built with [Astro Starlight](https://starlight.astro.build) and deployed to GitHub Pages.

See [PLAN.md](PLAN.md) for the curriculum and roadmap.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Add content

Lessons are Markdown/MDX files in `src/content/docs/`:

- `it/<track>/<module>.mdx`: IT security
- `ot/<track>/<module>.mdx`: OT/ICS security

The sidebar is generated automatically from these folders.

## Deploy

Every push to `main` builds and publishes the site to https://harikrishnanea94.github.io/utthandy-portal/ through `.github/workflows/deploy.yml`. utthandy.com forwards there with a registrar redirect. Because the site is served under `/utthandy-portal/`, in-content links must be relative.
