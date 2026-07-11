# Portfolio Skeleton (Task 1) - Semantic & Accessible Infrastructure

## Developer Profile
*   **Name:** Krishna Nayak
*   **Qualifications:** B.Tech Computer Science Engineering, ITER (SOA University)
*   **Key Competencies:** Python, Django, React, HTML5, CSS3, ES6+, Git, GitHub

## Project Overview
This repository contains the semantic markup foundation for my professional web portfolio. Designed strictly around the principles of document hierarchy and digital accessibility, it provides a standards-compliant base for future styling upgrades.

### Key Architectural Standards Met:
1.  **Strict Semantic Markup:** Completely structured with modern HTML5 layout tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) with no styling wrappers or "div-soup."
2.  **Web Content Accessibility Guidelines (WCAG) 2.1 AA Compliance:**
    *   **Skip-to-Content Navigation:** Fully interactive bypass links for screen reader and keyboard-only users.
    *   **Logical Heading Flow:** Headings strictly nested sequentially (`H1` to `H2` to `H3`) without skipping semantic levels.
    *   **ARIA Accessibility Bindings:** Used proper attributes such as `aria-current="page"`, `aria-describedby` for auxiliary field contexts, and explicit `aria-label` declarations.
3.  **Search Engine Optimization (SEO) & Sharing Integrations:**
    *   Optimized Title, Description, and Keywords metadata.
    *   Integrated Person Schema.org JSON-LD structured layout directly in `<head>`.
    *   Configured OpenGraph Protocol and Twitter Card support tags.

---

## Folder Architecture
```text
task-1-portfolio-skeleton/
├── index.html                  # Home & Professional Biography
├── projects.html               # Technical Case Studies (DrishtiRakshak AI, Ambulance Tracker)
├── contact.html                # Form featuring explicit label linkage & ARIA bindings
├── assets/
│   ├── documents/
│   │   └── resume.pdf          # Professional CV File (Placeholder)
│   └── images/
│       └── placeholder.png     # Static resource file
└── README.md                   # Technical Documentation (Current File)