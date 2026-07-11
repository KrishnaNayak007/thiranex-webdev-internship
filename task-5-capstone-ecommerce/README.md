# Modern E-Commerce Storefront (Task 5) - Single Page Application

## Developer Profile
*   **Name:** Krishna Nayak
*   **Qualifications:** B.Tech Computer Science Engineering, ITER (SOA University)
*   **Key Competencies:** SPA Architecture, Client-side Hash Routers, Immutability, Continuous Deployment

## Architectural Implementation Details

### 1. Client-Side Hash Router
This application operates as a true Single Page Application (SPA). By leveraging the native browser `'hashchange'` event, our JS router handles navigation without triggering page reloads. Views (Home, Catalog, and Cart) are dynamically generated and painted onto the target `<main id="app-view">` node.

### 2. Immutable State Management System
To prevent standard state mutation bugs common in junior portfolios, all state changes (adding, modifying quantities, or removing cart items) are handled using **immutable array and object transformations** (such as array spreading and mapping).

### 3. Dynamic Real-time Searching & Filtering
The product catalog features an optimized multi-tier search engine. Typing in the search bar or clicking category filter pills queries the local product state array instantly, giving the user a highly responsive browsing experience.

---

## Folder Architecture
```text
task-5-capstone-ecommerce/
├── index.html                  # Single SPA HTML mounting node
├── assets/
│   ├── css/
│   │   └── style.css           # Grid catalogs, table summaries, media boundaries
│   └── js/
│       └── app.js              # SPA router, Catalog search, Immutable Cart operations
└── README.md                   # Operational setup and Deployment instructions (Current File)