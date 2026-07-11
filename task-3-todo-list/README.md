# State-Driven Task Manager (Task 3) - Event Delegation Engine

## Developer Profile
*   **Name:** Krishna Nayak
*   **Qualifications:** B.Tech Computer Science Engineering, ITER (SOA University)
*   **Key Competencies:** JavaScript (ES6+), State Architectures, Event Delegation, LocalStorage Sync

## Technical Architecture Deep-Dive

### 1. State-Driven UI Lifecycle
This application avoids unstructured DOM insertions. The system runs an inline unidirectional flow:
*   An action occurs (e.g., Checkbox ticked, Form submitted).
*   The raw interaction updates the `state` object arrays directly.
*   A centralized `render()` loop is invoked to safely flush and update the DOM layout.

### 2. Event Delegation
To minimize memory utilization, event listeners are not registered directly on individual task rows. Instead, a single wrapper listener handles bubble events on the parent `#task-list` container. Clicking children extracts identifiers from custom HTML datasets (`data-id`), mapping targets directly.

### 3. Cross-Site Scripting (XSS) Sanitization
To guarantee production-quality security, all strings entered into task forms are scrubbed via a native character replacement map (`escapeHTML`) before the content is appended as markup inside the template literals.

---

## Folder Architecture
```text
task-3-todo-list/
├── index.html                  # Dashboard & accessibility wrappers
├── assets/
│   ├── css/
│   │   └── style.css           # Grid modules, custom checkboxes, progress nodes
│   └── js/
│       └── app.js              # State Engine, Event Delegation loops, persistence layers
└── README.md                   # Technical Documentation (Current File)