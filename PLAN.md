# Utthandy — Cybersecurity Training Portal: Plan

**Domain:** utthandy.com · **Hosting:** GitHub Pages · **Focus:** IT security first (~80%), OT/ICS security second (~20%)

---

## 1. Key constraint: GitHub Pages is static

GitHub Pages serves only static files: no server, no database, no server-side login. That shapes the design:

| Need | How it works on a static site |
|---|---|
| Courses / lessons | Markdown/MDX files compiled to HTML at build time |
| Quizzes | Client-side JavaScript, answers checked in the browser |
| Progress tracking | Browser `localStorage` (per device), with export/import as JSON |
| CTF-style "flags" | Flags stored as SHA-256 hashes and compared in the browser. Good enough for training, but not cheat-proof. |
| Search | Static index built at build time (Pagefind) |
| Certificates | PDF/PNG generated in the browser after a track is finished |
| User accounts, leaderboards (later) | Optional third-party backend (Supabase or Firebase free tier) called from the browser. Deferred to Phase 4. |

## 2. Tech stack (recommended)

- **Astro + Starlight**: a static site generator built for docs and courses. It gives you sidebar navigation, built-in search (Pagefind), dark mode, mobile layout, i18n and MDX (Markdown with interactive components).
- **Interactive components**: small Preact/vanilla-JS islands for quizzes, flag checkers, progress bars and simulated terminals.
- **GitHub Actions**: builds on every push to `main` and deploys to Pages.
- **Content as code**: each lesson is one `.mdx` file, so adding a course is just a pull request.

Alternatives I looked at and didn't pick: Jekyll (GitHub's native option, but it's dated and interactivity is awkward) and Docusaurus (good, but heavier, and React is mandatory).

## 3. Domain and GitHub Pages setup

1. Create a GitHub repo, e.g. `utthandy-portal` (or `<username>.github.io`).
2. Add `public/CNAME` containing `utthandy.com`.
3. At your domain registrar, set these DNS records:
   - `A` @ → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` @ → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME` www → `<username>.github.io`
4. Repo Settings → Pages → Source: **GitHub Actions**; custom domain `utthandy.com`; tick **Enforce HTTPS** once the certificate is issued (this can take up to 24h).
5. **Verify the domain** under GitHub account Settings → Pages. This stops anyone else from claiming utthandy.com subdomains on GitHub (domain takeover).
6. Optional: add email records later (SPF/DMARC). Even if you won't send mail from the domain, a `v=spf1 -all` record stops spoofing.

## 4. Site structure

```
utthandy.com/
├── /                      Landing: what it is, tracks, "start learning"
├── /tracks/               Catalog of learning paths
├── /it/                   IT security tracks (primary)
├── /ot/                   OT / ICS security tracks
├── /labs/                 Hands-on challenges (CTF-style, in-browser)
├── /glossary/             Searchable security terms
├── /resources/            Cheat sheets, tools, external free labs
├── /progress/             Learner dashboard (from localStorage)
└── /about/  /contribute/  /legal/ (disclaimer, ethics, privacy)
```

## 5. Curriculum

### IT security (primary)
| # | Track | Sample modules |
|---|---|---|
| IT-0 | Security Foundations | CIA triad, threats vs. vulnerabilities vs. risk, attacker mindset, legal/ethics |
| IT-1 | Security Awareness (for everyone) | Phishing, passwords & MFA, social engineering, safe browsing, data handling |
| IT-2 | Networking for Security | TCP/IP, ports, DNS, HTTP/TLS, firewalls, Wireshark basics |
| IT-3 | Linux & Windows Essentials | CLI, permissions, logs, Active Directory basics, PowerShell |
| IT-4 | Web Application Security | OWASP Top 10, XSS, SQLi, auth flaws, secure coding |
| IT-5 | Identity & Access Management | AuthN/AuthZ, SSO, OAuth/OIDC, least privilege, PAM |
| IT-6 | Cloud Security | Shared responsibility, IAM misconfigs, AWS/Azure basics, CSPM |
| IT-7 | Blue Team / SOC | SIEM, log analysis, detection rules (Sigma), MITRE ATT&CK |
| IT-8 | Incident Response | NIST IR lifecycle, triage, forensics basics, playbooks |
| IT-9 | Offensive Basics (ethical) | Recon, scanning, exploitation concepts, reporting |
| IT-10 | Governance & Compliance | ISO 27001, NIST CSF 2.0, risk assessment, policies |

### OT / ICS security (secondary)
| # | Track | Sample modules |
|---|---|---|
| OT-0 | OT Fundamentals | PLCs, HMIs, SCADA, DCS; how IT and OT differ (safety and availability first) |
| OT-1 | OT Architecture | Purdue model, zones & conduits, DMZs, IT/OT convergence |
| OT-2 | Industrial Protocols | Modbus, DNP3, OPC UA, Profinet, why they lack security |
| OT-3 | OT Threats & Case Studies | Stuxnet, Ukraine grid, TRITON, Colonial Pipeline |
| OT-4 | Standards | IEC 62443, NIST SP 800-82, NERC CIP overview |
| OT-5 | OT Defense & Monitoring | Asset inventory, passive monitoring, segmentation, OT IR |

Each module follows the same pattern: **Learn** (lesson) → **Check** (quiz) → **Do** (lab/challenge) → **Recap** (cheat sheet).

Each track has difficulty tags (Beginner / Intermediate / Advanced) and an estimated time.

## 6. Interactive features (all client-side)

1. **Quiz component**: multiple choice or true/false, with explanations and a score saved to progress.
2. **Flag challenge component**: the learner finds a flag in provided artifacts (pcap, logs, HTML source, encoded strings) and the browser checks its hash.
3. **Simulated terminal**: scripted command responses to practise Linux, nmap-style output and log grepping safely.
4. **Log/packet analysis labs**: downloadable sample files with guided questions.
5. **Progress dashboard**: completed modules, scores and badges, plus export/import of progress.
6. **Completion certificate**: generated in the browser with the learner's name, track and date (marked "self-assessed").
7. **External lab links**: curated free resources (TryHackMe, PortSwigger Academy, OverTheWire, CISA ICS training).

## 7. Repository layout

```
utthandy-portal/
├── .github/workflows/deploy.yml   Build + deploy to Pages
├── astro.config.mjs               Site config (site: https://utthandy.com)
├── public/
│   ├── CNAME                      utthandy.com
│   ├── favicon.svg
│   └── labs/                      Downloadable lab files
├── src/
│   ├── content/docs/
│   │   ├── index.mdx              Landing page
│   │   ├── it/<track>/<module>.mdx
│   │   ├── ot/<track>/<module>.mdx
│   │   ├── labs/ glossary/ resources/
│   ├── components/
│   │   ├── Quiz.astro / Quiz.tsx
│   │   ├── FlagCheck.tsx
│   │   ├── Terminal.tsx
│   │   ├── ProgressTracker.ts
│   │   └── TrackCard.astro
│   ├── data/quizzes/*.json         Quiz banks
│   └── styles/theme.css            Branding
├── CONTRIBUTING.md                Lesson template and style guide
└── README.md
```

## 8. Phased roadmap

### Phase 0: Setup (day 1)
- [ ] `git init`, scaffold Astro + Starlight, set up branding (name, logo, colors)
- [ ] Create the GitHub repo, add the deploy workflow and the CNAME file
- [ ] Configure DNS, verify the domain, enforce HTTPS
- [ ] Ship a "Coming soon" landing page live at utthandy.com

### Phase 1: MVP (weeks 1–3)
- [ ] Landing page, track catalog, about/legal pages
- [ ] Quiz component and progress tracking (localStorage)
- [ ] Content: **IT-0 Foundations**, **IT-1 Security Awareness**, **OT-0 OT Fundamentals** (3–5 modules each)
- [ ] Glossary (~50 terms), search, SEO basics (sitemap, meta, Open Graph)

### Phase 2: Hands-on (weeks 4–7)
- [ ] Flag-challenge and simulated-terminal components
- [ ] Tracks IT-2, IT-3, IT-4 (Web/OWASP) and OT-1, OT-2
- [ ] First 10 lab challenges, progress dashboard and badges

### Phase 3: Depth (weeks 8–14)
- [ ] Tracks IT-5 to IT-8 and OT-3 to OT-5
- [ ] Completion certificates, downloadable cheat sheets (PDF)
- [ ] Privacy-friendly analytics (Plausible, GoatCounter or Cloudflare Web Analytics)

### Phase 4: Optional backend (later)
- [ ] Accounts and cloud-synced progress via Supabase (GitHub/Google login)
- [ ] Leaderboards, server-validated flags (Supabase Edge Functions)
- [ ] Organization/team mode for corporate awareness training

## 9. Quality, security and legal

- **Site security:** strict CSP via `<meta>` tag (Pages can't set headers; use Cloudflare in front if you need real headers), no third-party scripts beyond analytics, Dependabot on, all actions pinned to versions.
- **Accessibility:** WCAG 2.1 AA, keyboard-navigable quizzes, good contrast.
- **CI checks:** build, link checker, spell check, Lighthouse score on each pull request.
- **Legal:** an ethics disclaimer ("only test systems you own or have permission to test"), a privacy note (progress stays in the browser) and a content license (e.g. CC BY-NC-SA for lessons, MIT for code).
- **Content accuracy:** cite primary sources (NIST, CISA, OWASP, MITRE) and put a "last reviewed" date on each lesson.

## 10. Open decisions

1. **GitHub username/org** that will own the repo (needed for DNS `www` record and repo name).
2. **Audience:** individual learners/students, corporate employees (awareness), or aspiring professionals? This sets the tone and depth.
3. **Branding:** is "Utthandy" the portal name? Do you have a logo or colors?
4. **Accounts:** is device-local progress enough for launch, or are logins required from day 1 (that would pull Phase 4 forward)?
5. **Content authoring:** will you write lessons, should Claude draft them for your review, or a mix?
6. **Monetization:** free/open, or paid tiers later? Paid tiers would mean moving off pure GitHub Pages for gated content.
