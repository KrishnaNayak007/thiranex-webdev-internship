# Upgraded Responsive Portfolio (Task 2) - Custom CSS System & Theme Engine

## Developer Profile
*   **Name:** Krishna Nayak
*   **Qualifications:** B.Tech Computer Science Engineering, ITER (SOA University)
*   **Key Competencies:** Python, Django, React, CSS Grid, CSS Custom Properties, JS Theme Engines

## Project Overview
This project upgrades the semantic layout built in Task 1. It integrates a custom CSS layout system, standard styling architecture, responsive layouts, CSS Custom variables, and a non-blocking Dark Mode Theme Engine.

### Applied CSS3 & Engineering Paradigms:
1.  **CSS Custom Variables (Theme Engine):** Supports global color modes completely tied to relative root selectors (`:root` and `[data-theme="dark"]`).
2.  **CSS Flexbox (1-Dimensional Layout):** Directs fluid layout parameters in header boxes, navigation, action buttons, and social arrays.
3.  **CSS Grid (2-Dimensional Layout):** Directs adaptive grids on multi-column pages and responsive project showcases (`projects.html`).
4.  **No-Flash Theme Engine Initialization:** Prevents Flash of Unstyled Content (FOUC) by executing a render-blocking head script evaluating client preference *prior* to parsing the paint loop.
5.  **A11y Safety (Reduced Motion Support):** Disables animated transforms automatically if the user has enabled OS level reduced-motion configurations.

---

## Folder Architecture
```text
task-2-portfolio-responsive/
├── index.html
├── projects.html
├── contact.html
├── assets/
│   ├── css/
│   │   └── style.css           # Grid, Flexbox, Variable Engine definitions
│   ├── js/
│   │   └── theme.js            # Live listener events and storage bindings
│   ├── documents/
│   │   └── resume.pdf
│   └── images/
│       └── placeholder.png
└── README.md